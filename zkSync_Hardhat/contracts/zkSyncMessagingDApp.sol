//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.8;

contract zkSyncMessagingDApp {
    struct User {
        string name;
        address publicAddress;
        friend[] friends;
    }

    struct friend {
        string name;
        address publicAddress;
    }

    struct message {
        address msgSenderPubKey;
        string msgData;
        uint256 timestamp;
    }

    mapping (address => User) Users;
    mapping (bytes32 => message[]) messages;

    function _checkUserExists(address userAddress) internal view returns(bool) {
        return (bytes(Users[userAddress].name).length > 0);
    }

    function createUser(string calldata username) external {
        require(_checkUserExists(msg.sender) == false, "User Account already created for this wallet");
        require(bytes(username).length > 0, "Please Enter Your Name");
        Users[msg.sender].name = username;
        Users[msg.sender].publicAddress = msg.sender;
    }

    function getUserName(address publicAddress) external view returns(string memory) {
        require(_checkUserExists(publicAddress), "There has been no User Account created with this wallet public Address");
        return (Users[publicAddress].name);
    }

    function addFriend(string memory friendName, address friend_address) public {
        require(_checkUserExists(msg.sender), "Please Create Your User Account");
        require(_checkUserExists(friend_address), "There has been no User Account created with this wallet public Address");
        require(msg.sender != friend_address, "You Can't Add Your Own Public Address in your Friends List");
        require(_alreadyFriends(msg.sender, friend_address) == false, "You are already a Friend with that person");
        _addFriend(msg.sender, friendName, friend_address);
        _addFriend(friend_address, Users[msg.sender].name, msg.sender);
    }

    function _alreadyFriends(address publickey1, address publickey2) internal view returns(bool) {
        if (Users[publickey1].friends.length > Users[publickey2].friends.length){
            address swap = publickey1;
            publickey2 = publickey1;
            publickey1 = swap;
        }

        for (uint256 index = 0; index < Users[publickey1].friends.length; index++) {
            if(Users[publickey1].friends[index].publicAddress == publickey2) {
                return true;
            }
        }
        return false;
    }

    function _addFriend(address publicKey1, string memory name, address publicKey2) internal {
        Users[publicKey1].friends.push(friend(name, publicKey2));
    }

    function getMyFriends() external view returns(friend[] memory) {
        return Users[msg.sender].friends;
    }

}