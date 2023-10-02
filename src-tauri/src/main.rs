#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{env, fs};

#[tauri::command]
fn get_full_path() -> String {
    let default_path = String::from("");
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        return default_path;
    }
    let file_path = &args[1];

    let full_path = match fs::canonicalize(file_path) {
        Ok(full_path) => return full_path.display().to_string(),
        Err(_) => default_path,
    };

    return full_path;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_full_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
