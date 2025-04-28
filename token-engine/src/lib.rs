// token-engine/src/lib.rs
use wasm_bindgen::prelude::*;

// Zorg ervoor dat de wasm-bindgen runtime wordt geïnitialiseerd
#[wasm_bindgen(start)]
pub fn start() {
    // Optioneel: paniek hook voor betere foutmeldingen
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// Exporteer een functie naar JavaScript, gebruik u32 in plaats van u64
// om compatibiliteit met JS numbers te verbeteren
#[wasm_bindgen]
pub fn add(left: u32, right: u32) -> u32 {
    left + right
}

// Exporteer nog een functie voor demo doeleinden
#[wasm_bindgen]
pub fn hello(name: &str) -> String {
    format!("Hallo, {}! Groeten vanuit Rust WASM!", name)
}

// Exporteer een struct voor meer complexe interacties (optioneel)
#[wasm_bindgen]
pub struct Calculator {
    value: u32,
}

#[wasm_bindgen]
impl Calculator {
    pub fn new(initial: u32) -> Calculator {
        Calculator { value: initial }
    }

    pub fn add(&mut self, value: u32) -> u32 {
        self.value += value;
        self.value
    }

    pub fn subtract(&mut self, value: u32) -> u32 {
        self.value -= value;
        self.value
    }

    pub fn get_value(&self) -> u32 {
        self.value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}