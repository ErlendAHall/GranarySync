#![allow(non_snake_case)]
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct GranaryOptions {
    pub syncPaths: Vec<SyncPath>,
    pub backupsPerDay: u8
}
#[derive(Deserialize, Serialize, Debug, Default)]
pub struct SyncPath {
    pub name: String,
    pub origin: String,
    pub destination: String,
}