use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Counter {
    count: i32,
}

#[wasm_bindgen]
impl Counter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Counter {
        web_sys::console::log_1(&"Counter: Created new instance".into());
        Counter { count: 0 }
    }

    pub fn value(&self) -> i32 {
        web_sys::console::log_1(&format!("Counter: Getting value: {}", self.count).into());
        self.count
    }

    pub fn increment(&mut self) -> i32 {
        self.count += 1;
        web_sys::console::log_1(&format!("Counter: Incremented to {}", self.count).into());
        self.count
    }

    pub fn decrement(&mut self) -> i32 {
        self.count -= 1;
        web_sys::console::log_1(&format!("Counter: Decremented to {}", self.count).into());
        self.count
    }

    pub fn reset(&mut self) -> i32 {
        self.count = 0;
        web_sys::console::log_1(&"Counter: Reset to 0".into());
        self.count
    }
}
