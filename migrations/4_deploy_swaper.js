const TokenOne = artifacts.require("TokenOne");
const TokenTwo = artifacts.require("TokenTwo");
const Swap = artifacts.require("Swap");


module.exports = function(deployer, accounts) {

    deployer.deploy(TokenOne);
    deployer.deploy(TokenTwo).then(function (){
        return deployer.deploy(Swap, TokenOne.address, TokenTwo.address);
    });
};
