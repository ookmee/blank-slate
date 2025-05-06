use wasm_bindgen::prelude::*;
use std::collections::VecDeque;
use std::cell::RefCell;
use std::rc::Rc;

#[wasm_bindgen]
pub struct Logger {
    entries: Rc<RefCell<VecDeque<String>>>,
    max_entries: usize,
}

#[wasm_bindgen]
impl Logger {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Logger {
        web_sys::console::log_1(&"Logger: Created new instance".into());
        Logger {
            entries: Rc::new(RefCell::new(VecDeque::new())),
            max_entries: 100,
        }
    }
    
    pub fn log(&self, module: &str, message: &str) {
        let timestamp = js_sys::Date::now();
        let entry = format!("[{}] [{}] {}", timestamp, module, message);
        
        // Clone the entry before using it with log_1
        web_sys::console::log_1(&entry.clone().into());
        
        let mut entries = self.entries.borrow_mut();
        if entries.len() >= self.max_entries {
            entries.pop_front();
        }
        entries.push_back(entry);
    }
    
    pub fn get_logs(&self) -> String {
        let entries = self.entries.borrow();
        let logs = entries.iter().cloned().collect::<Vec<_>>().join("\n");
        logs
    }
    
    pub fn clear(&self) {
        let mut entries = self.entries.borrow_mut();
        entries.clear();
        web_sys::console::log_1(&"Logger: Cleared logs".into());
    }
}
