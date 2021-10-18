use operations::operations::{increase_backup_frequency, add_sync_path, delete_sync_path};
use parsing::numeric::parse_to_u8;
use structs::structs::{GranaryOptions, SyncPath};
use std::io::{self, Write};

mod operations;
mod options;
mod structs;
mod parsing;
mod validation;

macro_rules! go_tits_up {
    ($($x:tt)*) => {
        panic!($($x)*)
    }
}


pub extern "Rust" fn main() {
    let options_location = String::from("options.json");
    let options: GranaryOptions = get_options(&options_location);
    println!("{}", "Make you choice:");
    println!("{}", "0: Increase backup frequency");
    println!("{}", "1: Add backup target");
    println!("{}", "2: Remove backup target");
    print!("> ");
    io::stdout().flush().unwrap();
    let choice_index: u8 = get_user_choice_index();
    println!();
    
    match choice_index {
        0 => {
            println!("Input new backup frequency, current is {}", options.backupsPerDay);
            let user_stdin = get_user_stdin();
            let backup_freq_changed = increase_backup_frequency(parse_to_u8(&user_stdin), &options_location);

            if backup_freq_changed {
                println!("Backup frequency was changed to {}", user_stdin);
            } else {
                println!("An unknown error has occured")
            }

        }

        1 => {
            println!("Here are the current syncpaths:\n");
            for sync_path in options.syncPaths {
                println!("{} --> {}", sync_path.origin, sync_path.destination);
            }
            let mut new_sync_path = SyncPath::default();
            println!("Input the origin as an absolute path: ");
            new_sync_path.origin = get_user_stdin();
            println!("Input the destination as an absolute path: ");
            new_sync_path.destination = get_user_stdin();
            println!("Give the syncpath a friendly name (optional)");
            new_sync_path.name = get_user_stdin();

            let sync_path_added = add_sync_path(new_sync_path, &options_location);

            if sync_path_added {
                println!("New sync path added");
            } else {
                println!("An unknown error has occured")
            }
        }

        2 => {
            for (i, sync_path) in options.syncPaths.iter().enumerate() {
                println!("{}: {} --> {}", i, sync_path.origin, sync_path.destination);
            }

            print!("{}", "Input the index to remove: ");
            io::stdout().flush().unwrap();

            let delete_index = get_user_choice_index();

            if (delete_index as usize) < options.syncPaths.len() {
                delete_sync_path(delete_index, &options_location);
            }

        }

        3_u8..=u8::MAX => {
            println!("{}", "Not a valid choice")
        }
    }
}

fn get_user_choice_index() -> u8 {
    let mut buffer = String::new();
    match io::stdin().read_line(&mut buffer) {
        Ok(_res) => {
            return parse_to_u8(&buffer);
        }

        Err(err) => {
            go_tits_up!("oh noes, something bad happened {}", err)
        }
    }
}

fn get_user_stdin() -> String {
    let mut buffer = String::new();
    io::stdin().read_line(&mut buffer).ok();
    
    if buffer.ends_with("\n") {
        return String::from(buffer[0..buffer.len() - 1].to_string().trim());
    } else {
        return String::from(buffer.trim());
    }
}

fn get_options(location: &String) -> GranaryOptions {
    return options::options_parser::read_json(&location).unwrap();
}