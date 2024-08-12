use axum::{
    routing::{get,post},
    http::StatusCode,
    response::IntoResponse,
    extract::Path,
    Json,
    Router};
}

use std::net::SocketAddr;
use serde::{Deserialize,Serialize};

#[tokio::main]
async fn main() {
    tracing_subscriber::ftm::init();
    let app = Router::new()
        .route("/", get(root))
        .route("/getSamples", get(getSamples));

        let addr = SocketAddr::from(([127,0,0,1], 3000));
        tracing::info!("listening on {}", addr);
        axum::Server::bind(&addr)
            .serve(app.into_make_service())
            .await
            .unwrap();
}

async fn root() -> &'static str {
    "Hello, Chompi!"
}

async fn getSamples() -> impl IntoResponse {
    let response: Vec[] = 
}

struct Sample {
    name: String,

}