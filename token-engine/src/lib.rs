use wasm_bindgen::prelude::*;

// A simple function that returns a string
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// A simple function to add two numbers
#[wasm_bindgen]
pub fn add_numbers(a: i32, b: i32) -> i32 {
    a + b
}

// A simple struct with minimal functionality
#[wasm_bindgen]
pub struct SimpleUser {
    name: String,
}

#[wasm_bindgen]
impl SimpleUser {
    #[wasm_bindgen(constructor)]
    pub fn new(name: &str) -> SimpleUser {
        SimpleUser {
            name: name.to_string(),
        }
    }

    #[wasm_bindgen]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen]
    pub fn greet(&self) -> String {
        format!("Hello, my name is {}!", self.name)
    }
}
