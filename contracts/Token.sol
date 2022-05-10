//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    address public owner;
    string public _name;
    string public _symbol;
    uint8 public _decimals;
    uint256 public _totalSupply;

    mapping(address =>uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    modifier ownerOnly() {
        require(msg.sender == owner, "You are not owner");
        _;
    }
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory newName, string memory newSymbol, uint8 newDecimals, uint256 newTotalSupply) {
        _name = newName;
        _symbol = newSymbol;
        owner = msg.sender;
        _decimals = newDecimals;
        _totalSupply = newTotalSupply;
        _balances[owner] = _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256){
        return _balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256){
        return _allowances[_owner][_spender];
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_balances[msg.sender] > _value, "Not enough balance");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_balances[_from] > _value, "Not enough balance");
        _balances[_from] -= _value;
        _balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success){
        require(_balances[msg.sender] > _value, "Not enough balance");
        _allowances[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function burn(address account, uint256 amount) public ownerOnly {
        require(_balances[account] > amount, "Not enough balance");
        _totalSupply -= amount;
        _balances[account] -= amount;
        emit Transfer(account, address(0), amount);
    }

    function mint(address account, uint256 amount) public ownerOnly {
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
