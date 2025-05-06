use wasm_bindgen::prelude::*;
use super::logger::Logger;
use crate::core::calculator::Calculator;
use crate::core::counter::Counter;

#[wasm_bindgen]
pub struct DebugPanel {
    logger: Logger,
    calculator: Calculator,
    counter: Counter,
}

#[wasm_bindgen]
impl DebugPanel {
    #[wasm_bindgen(constructor)]
    pub fn new() -> DebugPanel {
        // Initialize the logger first
        let logger = Logger::new();
        logger.log("DebugPanel", "Initializing new debug panel");
        
        // Initialize other components
        let calculator = Calculator::new();
        let counter = Counter::new();
        
        logger.log("DebugPanel", "Components initialized");
        
        DebugPanel {
            logger,
            calculator,
            counter,
        }
    }
    
    pub fn log_message(&self, module: &str, message: &str) {
        self.logger.log(module, message);
    }
    
    pub fn get_logs(&self) -> String {
        self.logger.get_logs()
    }
    
    pub fn clear_logs(&self) {
        self.logger.clear();
    }
    
    pub fn increment_counter(&mut self) -> i32 {
        self.logger.log("DebugPanel", "Incrementing counter");
        let result = self.counter.increment();
        
        // Demonstrate interdependence by mirroring counter value in calculator
        self.calculator.add(1);
        
        result
    }
    
    pub fn decrement_counter(&mut self) -> i32 {
        self.logger.log("DebugPanel", "Decrementing counter");
        let result = self.counter.decrement();
        
        // Demonstrate interdependence by mirroring counter value in calculator
        self.calculator.subtract(1);
        
        result
    }
    
    pub fn reset_counter(&mut self) -> i32 {
        self.logger.log("DebugPanel", "Resetting counter");
        let result = self.counter.reset();
        
        // Demonstrate interdependence by also resetting calculator
        self.calculator.reset();
        
        result
    }
    
    pub fn add_calculator(&mut self, amount: i32) -> i32 {
        self.logger.log("DebugPanel", &format!("Calculator adding {}", amount));
        let result = self.calculator.add(amount);
        
        // Demonstrate interdependence by incrementing counter for each unit
        for _ in 0..amount {
            self.counter.increment();
        }
        
        result
    }
    
    pub fn subtract_calculator(&mut self, amount: i32) -> i32 {
        self.logger.log("DebugPanel", &format!("Calculator subtracting {}", amount));
        let result = self.calculator.subtract(amount);
        
        // Demonstrate interdependence by decrementing counter for each unit
        for _ in 0..amount {
            self.counter.decrement();
        }
        
        result
    }
    
    pub fn reset_calculator(&mut self) -> i32 {
        self.logger.log("DebugPanel", "Resetting calculator");
        let result = self.calculator.reset();
        
        // Demonstrate interdependence by also resetting counter
        self.counter.reset();
        
        result
    }
    
    pub fn get_calculator_value(&self) -> i32 {
        self.calculator.get_value()
    }
    
    pub fn get_counter_value(&self) -> i32 {
        self.counter.value()
    }
    
    pub fn run_demo(&mut self) -> String {
        self.logger.log("DebugPanel", "Running demonstration");
        
        // Reset components
        self.counter.reset();
        self.calculator.reset();
        
        // Perform some operations
        self.counter.increment();
        self.counter.increment();
        self.logger.log("Demo", &format!("Counter value: {}", self.counter.value()));
        
        self.calculator.add(5);
        self.calculator.subtract(2);
        self.logger.log("Demo", &format!("Calculator value: {}", self.calculator.get_value()));
        self.logger.log("Demo", &format!("Last operation: {}", self.calculator.get_last_operation()));
        
        // Show interdependence
        let calc_value = self.calculator.get_value();
        let counter_value = self.counter.value();
        self.logger.log("Demo", &format!("Calculator value: {}, Counter value: {}", calc_value, counter_value));
        
        "Demo completed successfully!".to_string()
    }
}
