use crate::structs::structs::{GranaryOptions, SyncPath};
use crate::options::options_parser::read_json;
use crate::options::options_writer::write_json;
use std::convert::TryFrom; 

pub fn increase_backup_frequency(new_frequency: u8, location: &String) -> bool {
    let mut options: GranaryOptions = read_json(location).unwrap();
    options.backupsPerDay = new_frequency;
    return write_json(options, location);
}

pub fn add_sync_path(new_sync_path: SyncPath, location: &String) -> bool {
    let mut options: GranaryOptions = read_json(location).unwrap();
    options.syncPaths.push(new_sync_path);
    return write_json(options, &location);
}

pub fn delete_sync_path(del_index: u8, location: &String) -> bool {
    let mut options: GranaryOptions = read_json(location).unwrap();
    options.syncPaths.swap_remove(usize::try_from(del_index).unwrap());
    return write_json(options, &location);
}