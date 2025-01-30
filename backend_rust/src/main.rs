use std::{error::Error, sync::Arc};

use argon2::Argon2;
use axum::{
    extract::{Path, Request, State},
    http::StatusCode,
    middleware::{self, Next},
    response::IntoResponse,
    routing::{delete, get, post, put},
    Extension, Json, Router,
};
use jsonwebtoken::{get_current_timestamp, DecodingKey, EncodingKey, Validation};
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, sqlite::SqlitePoolOptions, SqlitePool};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

struct AppState {
    db: SqlitePool,
    argon2: Argon2<'static>,
    encoding_key: EncodingKey,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let state = Arc::new(AppState {
        db: SqlitePoolOptions::new()
            .connect("sqlite://data.sqlite")
            .await?,
        argon2: Argon2::default(),
        encoding_key: EncodingKey::from_secret("87882f51-a7aa-40d7-95d3-bdc877382428".as_bytes()),
    });
    let cors_layer = CorsLayer::new()
        .allow_methods(tower_http::cors::Any)
        .allow_headers(tower_http::cors::Any)
        .allow_origin(tower_http::cors::Any);

    let app = Router::new()
        .route("/", get(hi))
        .route("/api/tasks", get(get_tasks))
        .route("/api/tasks", post(add_task))
        .route("/api/tasks/{id}", get(get_task))
        .route("/api/tasks/{id}", put(update_task))
        .route("/api/tasks/{id}", delete(delete_task))
        .layer(middleware::from_fn_with_state(
            Arc::new(DecodingKey::from_secret(
                "87882f51-a7aa-40d7-95d3-bdc877382428".as_bytes(),
            )),
            auth,
        ))
        .route("/api/register", post(register))
        .route("/api/login", post(login))
        .layer(cors_layer)
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn hi() -> impl IntoResponse {
    "aa"
}
async fn get_tasks(
    State(state): State<Arc<AppState>>,
    Extension(user_id): Extension<i64>,
) -> impl IntoResponse {
    let tasks = query_as!(
        Task,
        "SELECT id, title, description, priority, status FROM Tasks WHERE user_id=$1;",
        user_id
    )
    .fetch_all(&state.db)
    .await
    .unwrap();
    Json::from(tasks)
}
async fn get_task(
    State(state): State<Arc<AppState>>,
    Extension(user_id): Extension<i64>,
    Path(id): Path<i64>,
) -> impl IntoResponse {
    let task = query_as!(
        Task,
        "SELECT id, title, description, priority, status FROM Tasks WHERE id=$1 AND user_id=$2;",
        id,
        user_id
    )
    .fetch_one(&state.db)
    .await
    .unwrap();
    Json::from(task)
}
async fn add_task(
    State(state): State<Arc<AppState>>,
    Extension(user_id): Extension<i64>,
    Json(task): Json<Task>,
) -> impl IntoResponse {
    match query!(
        "INSERT INTO Tasks( title, description, priority, status, user_id ) VALUES ($1, $2, $3, $4, $5);",
        task.title,
        task.description,
        task.priority,
        task.status,
        user_id
    )
    .execute(&state.db)
    .await {
        Ok(_) => (StatusCode::CREATED, "".to_string()),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}
async fn delete_task(
    State(state): State<Arc<AppState>>,
    Extension(user_id): Extension<i64>,
    Path(id): Path<i64>,
) -> impl IntoResponse {
    match query!("DELETE FROM Tasks WHERE id=$1 AND user_id=$2;", id, user_id)
        .execute(&state.db)
        .await
    {
        Ok(_) => (StatusCode::OK, "".to_string()),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
    }
}
async fn update_task(
    State(state): State<Arc<AppState>>,
    Extension(user_id): Extension<i64>,
    Path(id): Path<i64>,
    Json(task): Json<Task>,
) -> impl IntoResponse {
    match query!(
        "UPDATE Tasks SET title=$1, description=$2, priority=$3, status=$4 WHERE id=$5 AND user_id=$6;",
        task.title,
        task.description,
        task.priority,
        task.status,
        id,
        user_id
    )
    .execute(&state.db)
    .await {
        Ok(_) => (StatusCode::CREATED, "".to_string()),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct Task {
    id: Option<i64>,
    title: String,
    description: Option<String>,
    priority: String,
    status: String,
}

async fn auth(
    State(decoding_key): State<Arc<DecodingKey>>,
    mut req: Request,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let value = req.headers().get("Authorization");

    if value.is_none() {
        return Err((
            StatusCode::UNAUTHORIZED,
            "No Authorization header".to_string(),
        ));
    }
    if value.unwrap().len() < 10 {
        return Err((
            StatusCode::UNAUTHORIZED,
            "Token too short or malformed".to_string(),
        ));
    }

    match jsonwebtoken::decode::<Claims>(
        &value.unwrap().to_str().unwrap()[7..],
        &decoding_key,
        &Validation::default(),
    ) {
        Ok(jwt) => {
            req.extensions_mut().insert(jwt.claims.id);
            //a
            Ok(next.run(req).await)
        }
        Err(err) => Err((StatusCode::UNAUTHORIZED, format!("{}", err))),
    }
}

async fn register(State(state): State<Arc<AppState>>, Json(user): Json<User>) -> impl IntoResponse {
    let mut hashed = vec![0; 32];
    if user.username.is_none() {
        return (StatusCode::BAD_REQUEST, "No username provided".to_string());
    }

    state
        .argon2
        .hash_password_into(
            user.password.as_bytes(),
            format!("{:>8}", user.email).as_bytes(),
            &mut hashed,
        )
        .unwrap();

    match query!(
        "INSERT INTO Users(username, email, password) VALUES ($1, $2, $3);",
        user.username,
        user.email,
        hashed
    )
    .execute(&state.db)
    .await
    {
        Ok(_) => (StatusCode::CREATED, user.email),
        Err(sqlx::Error::Database(e)) => {
            eprintln!("{:?}", e);
            if e.is_unique_violation() {
                return (StatusCode::CONFLICT, e.to_string());
            }
            (StatusCode::BAD_REQUEST, e.to_string())
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

async fn login(State(state): State<Arc<AppState>>, Json(user): Json<User>) -> impl IntoResponse {
    let mut hashed = vec![0; 32];
    state
        .argon2
        .hash_password_into(
            user.password.as_bytes(),
            format!("{:>8}", user.email).as_bytes(),
            &mut hashed,
        )
        .unwrap();

    match query!(
        "SELECT id FROM Users WHERE email=$1 AND password=$2;",
        user.email,
        hashed
    )
    .fetch_one(&state.db)
    .await
    {
        Ok(id) => {
            let token = jsonwebtoken::encode(
                &jsonwebtoken::Header::default(),
                &Claims {
                    id: id.id,
                    exp: get_current_timestamp() as usize + 3600, // one hour
                },
                &state.encoding_key,
            );
            (
                StatusCode::OK,
                format!(r#"{{"token":"{}"}}"#, token.unwrap()),
            )
        }
        Err(sqlx::Error::RowNotFound) => (
            StatusCode::NOT_FOUND,
            "Incorrect password or email".to_string(),
        ),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

#[derive(Debug, Deserialize)]
struct User {
    username: Option<String>,
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    id: i64,
    exp: usize,
}
