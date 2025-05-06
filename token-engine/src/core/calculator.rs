use wasm_bindgen::prelude::*;
use crate::debug;

#[wasm_bindgen]
pub struct Calculator {
    value: i32,
    last_operation: String,
}

#[wasm_bindgen]
impl Calculator {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: i32) -> Calculator {
        // Log the creation event
        debug::log_operation("Calculator", "new", &initial.to_string(), "Created new calculator instance");
        
        web_sys::console::log_1(&"Calculator: Created new instance".into());
        Calculator { 
            value: initial,
            last_operation: "none".to_string(),
        }
    }
    
    pub fn add(&mut self, amount: i32) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Adding {}", amount).into());
        self.value += amount;
        self.last_operation = format!("add_{}", amount);
        
        // Log the operation
        debug::log_operation("Calculator", "add", &self.value.to_string(), 
            &format!("Added {} to calculator", amount));
            
        self.value
    }
    
    pub fn subtract(&mut self, amount: i32) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Subtracting {}", amount).into());
        self.value -= amount;
        self.last_operation = format!("subtract_{}", amount);
        
        // Log the operation
        debug::log_operation("Calculator", "subtract", &self.value.to_string(), 
            &format!("Subtracted {} from calculator", amount));
            
        self.value
    }
    
    pub fn get_value(&self) -> i32 {
        web_sys::console::log_1(&format!("Calculator: Getting value: {}", self.value).into());
        
        // Log the read operation
        debug::log_operation("Calculator", "get_value", &self.value.to_string(), 
            "Read calculator value");
            
        self.value
    }
    
    pub fn get_last_operation(&self) -> String {
        web_sys::console::log_1(&format!("Calculator: Last operation was {}", self.last_operation).into());
        
        // Log the read operation
        debug::log_operation("Calculator", "get_last_operation", &self.last_operation, 
            "Read last operation");
            
        self.last_operation.clone()
    }
    
    pub fn reset(&mut self) -> i32 {
        web_sys::console::log_1(&"Calculator: Resetting".into());
        self.value = 0;
        self.last_operation = "reset".to_string();
        
        // Log the reset operation
        debug::log_operation("Calculator", "reset", "0", 
            "Reset calculator to zero");
            
        self.value
    }
}
