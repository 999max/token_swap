pragma solidity 0.6.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract TokenOne is ERC20 {
    address public owner;
    
    constructor() public ERC20("Token One", "ONE") {
        owner = msg.sender;
        _mint(owner, 100);
    }

    function getOwnerAdr() public view returns(address) {
        return owner;
    }
}


contract TokenTwo is ERC20 {
    address public owner;
    
    constructor() public ERC20("Token Two", "TWO"){
        owner = msg.sender;
        _mint(owner, 2000);
    }

    function getOwnerAdr() public view returns(address){
        return owner;
    }
}


contract Swap is ERC20 {
    
    TokenOne token1;
    TokenTwo token2;

    constructor(address tknAdr1, address tknAdr2) public ERC20("Swap tokens", "SWP") {
        token1 = TokenOne(tknAdr1);
        token2 = TokenTwo(tknAdr2);
    }
    
    function makeSwap(uint amount1, uint amount2) public {
        // add some if condition for transfer
        require(token1.allowance(token1.getOwnerAdr(), address(this)) >= amount1);
        require(token2.allowance(token2.getOwnerAdr(), address(this)) >= amount2);

        token1.transferFrom(token1.getOwnerAdr(), token2.getOwnerAdr(), amount1);
        token2.transferFrom(token2.getOwnerAdr(), token1.getOwnerAdr(), amount2);
    }
}
