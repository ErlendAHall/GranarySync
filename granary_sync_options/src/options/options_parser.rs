use serde_json;
use std::fs::File;
use std::io::BufReader;
use std::io::Error;

use crate::structs::structs::GranaryOptions;

pub fn read_json(location: &String) -> Result<GranaryOptions, Error> {
    let file = File::open(location)?;
    let reader = BufReader::new(file);
    let op = serde_json::from_reader(reader)?;
    Ok(op)
}
