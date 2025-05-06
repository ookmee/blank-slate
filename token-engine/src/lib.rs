use wasm_bindgen::prelude::*;

// Basic module structure
mod core;
mod debug;

// Simple add function for 1+1=2 functionality
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Simple counter with no dependencies
#[wasm_bindgen]
pub struct SimpleCounter {
    count: i32,
}

#[wasm_bindgen]
impl SimpleCounter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        SimpleCounter { count: 0 }
    }

    pub fn value(&self) -> i32 {
        self.count
    }

    pub fn increment(&mut self) -> i32 {
        self.count += 1;
        self.count
    }

    pub fn reset(&mut self) -> i32 {
        self.count = 0;
        self.count
    }
}
