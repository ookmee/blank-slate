use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Calculator {
    value: i32,
    last_operation: String,
}

#[wasm_bindgen]
impl Calculator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Calculator {
        web_sys::console::log_1(&"Calculator: Created new instance".into());
        Calculator { 
            value: 0,
            last_operation: "none".to_string(),
        }
    }
    
    pub fn add(&mut self, amount: i32) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Adding {}", amount).into());
        self.value += amount;
        self.last_operation = format!("add_{}", amount);
        self.value
    }
    
    pub fn subtract(&mut self, amount: i32) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Subtracting {}", amount).into());
        self.value -= amount;
        self.last_operation = format!("subtract_{}", amount);
        self.value
    }
    
    pub fn get_value(&self) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Getting value: {}", self.value).into());
        self.value
    }
    
    pub fn get_last_operation(&self) -> String {
        web_sys::console::log_1(&format!("Calculator: Last operation was {}", self.last_operation).into());
        self.last_operation.clone()
    }
    
    pub fn reset(&mut self) -> i32 {
        web_sys::console::log_1(&"Calculator: Resetting".into());
        self.value = 0;
        self.last_operation = "reset".to_string();
        self.value
    }

    pub fn get_operation_count(&self) -> i32 {
        let count = self.value.abs();
        web_sys::console::log_1(&format!("Calculator: Operation count is {}", count).into());
        count
    }
}
