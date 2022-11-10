// ######## Solution - Exercise 2 

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import deploy
from starkware.starknet.common.syscalls import get_contract_address, get_caller_address
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.messages import send_message_to_l1


//
// Declaring storage vars
// Storage vars are by default not visible through the ABI. They are similar to "private" variables in Solidity
//

@storage_var
func has_sent_message() -> (bool: felt) {
}


//
// Declaring getters
// Public variables should be declared explicitly with a getter
//

@view
func message_status{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
) -> (bool: felt) {
    let (result) = has_sent_message.read();
    return (bool=result);
}

// ######## Constructor
// This function is called when the contract is deployed
//
@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
) {
    return ();
}

// ######## External functions
// These functions are callable by other contracts
//

@external
func create_l1_nft_message{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    submitted_contract_address: felt, l1_user: felt 
) {
    alloc_locals;
    // Reading caller address
    let (sender_address) = get_caller_address();

    // Preparing payload
    let (message_payload: felt*) = alloc();
    assert message_payload[0] = sender_address;
    assert message_payload[1] = l1_user;

    // Sending the message.
    send_message_to_l1(to_address=submitted_contract_address, payload_size=2, payload=message_payload);
    
    // Recording transaction 
    has_sent_message.write(1);
    return ();
}


