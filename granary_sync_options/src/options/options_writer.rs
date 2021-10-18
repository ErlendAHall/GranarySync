use serde_json;
use std::fs::File;
use crate::structs::structs::GranaryOptions;

pub fn write_json(payload: GranaryOptions, location: &String) -> bool {
    let file = File::create(location).unwrap();
    match serde_json::to_writer_pretty(file, &payload) {
        Ok(_res) => {
            return true;
        }
        Err(err) => {
            println!("{}", err);
            return false;
        }
    }
}