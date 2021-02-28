const Swap = artifacts.require('Swap');
const TokenOne = artifacts.require('TokenOne');
const TokenTwo = artifacts.require('TokenTwo');


contract('Testcase for Swap', function (accounts) {

  const userOne = accounts[0];
  const userTwo = accounts[1];
  const swapCreator = accounts[2];

  beforeEach(async function () {
    token1 = await TokenOne.new({ from: userOne });
    token2 = await TokenTwo.new({ from: userTwo });
    swap = await Swap.new(token1.address, token2.address, { from: swapCreator });
    await token1.approve(swap.address, 80, { from: userOne });
    await token2.approve(swap.address, 300, { from: userTwo });
    //await swap.makeSwap(40, 140, { from: swapCreator});
  });
  
  it('should return correct token name for token1', async function() {
    const name1 = await token1.name();
    assert.equal(name1, 'Token One');
  });

  it('should return correct token name for token2', async function() {
    const name2 = await token2.name();
    assert.equal(name2, 'Token Two');
  });

  it('should return correct total supply for token1', async function() {
    const ts1 = await token1.totalSupply();
    assert.equal(ts1, 100);
  });

  it('should return correct total supply for token2', async function() {
    const ts2 = await token2.totalSupply();
    assert.equal(ts2, 2000);
  });

  it('should return correct address for userOne', async function() {
    const u1 = userOne;
    assert.equal(u1, '0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
  });

  it('should return correct address for token1 owner (userOne)', async function() {
    const owner1 = await token1.getOwnerAdr();
    assert.equal(owner1, accounts[0]);
  });

  it('should return correct address for token2 owner userTwo', async function() {
    const owner2 = await token2.getOwnerAdr();
    assert.equal(owner2, accounts[1]);
  });

  it('should return right balance of userOne before swap: 100', async function () {
    const balanceUserOneBeforeSwap = await token1.balanceOf(userOne);
    assert.equal(balanceUserOneBeforeSwap, 100);
  });
  
  it('should return right balance of userTwo before swap: 2000', async function () {
    const balanceUserTwoBeforeSwap = await token2.balanceOf(userTwo);
    assert.equal(balanceUserTwoBeforeSwap, 2000);
  });


  it('has allowance for Swap to spend TokenOne from UserOne', async function () {
    const allowanceFromUserOne = await token1.allowance(userOne, swap.address);
    assert.equal(allowanceFromUserOne, 80);
  });

  it('has allowance for Swap to spend TokenTwo from UserTwo', async function () {
    const allowanceFromUserTwo = await token2.allowance(userTwo, swap.address);
    assert.equal(allowanceFromUserTwo, 300);
  });


  // start to SWAP
  it('has new balances and allowances after making SWAP (t1(40) <-> t2(135)) ', async function () {
    await swap.makeSwap(40, 135, { from: swapCreator});
    const userOneBalanceForTokenOne = await token1.balanceOf(userOne);
    const userOneBalanceForTokenTwo = await token2.balanceOf(userOne);
    assert.equal(userOneBalanceForTokenOne, 100-40);
    assert.equal(userOneBalanceForTokenTwo, 135);

    const userTwoBalanceForTokenOne = await token1.balanceOf(userTwo);
    const userTwoBalanceForTokenTwo = await token2.balanceOf(userTwo);
    assert.equal(userTwoBalanceForTokenOne, 40);
    assert.equal(userTwoBalanceForTokenTwo, 2000-135);

    const allowanceFromUserOneAfterSwap = await token1.allowance(userOne, swap.address);
    assert.equal(allowanceFromUserOneAfterSwap, 80-40);

    const allowanceFromUserTwoAfterSwap = await token2.allowance(userTwo, swap.address);
    assert.equal(allowanceFromUserTwoAfterSwap, 300-135);
  });

});

