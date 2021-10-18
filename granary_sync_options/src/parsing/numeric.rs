pub fn parse_to_u8(input: &str) -> u8 {
    if input.ends_with("\n") {
        return input[0..input.len() - 1].to_string().trim().parse::<u8>().unwrap();
    } else {
        return input.trim().parse::<u8>().unwrap();
        
    }
}