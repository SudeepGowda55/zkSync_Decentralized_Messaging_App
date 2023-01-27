//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.8;

contract zkSyncMessagingDApp {
    struct User {
        string name;
        friend[] friends;
    }

    struct friend {
        string name;
        address publicAddress;
    }

    struct completeUser {
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

    completeUser[] allUsers;

    function _checkUserExists(address userAddress) internal view returns(bool) {
        return (bytes(Users[userAddress].name).length > 0);
    }

    function createUser(string calldata username) external {
        require(_checkUserExists(msg.sender) == false, "User Account already created for this wallet");
        require(bytes(username).length > 0, "Please Enter Your Name");
        Users[msg.sender].name = username;
        allUsers.push(completeUser(username, msg.sender));
    }

    function getUserName(address publicAddress) external view returns(string memory) {
        require(_checkUserExists(publicAddress), "There has been no User Account created with this wallet public Address");
        return (Users[publicAddress].name);
    }

    function getAllUsers() public view returns(completeUser[] memory) {
        return (allUsers);
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

    function _sessionKey(address publicKey1, address publicKey2) internal pure returns(bytes32) {
        if (publicKey1 > publicKey2){
            return keccak256(abi.encode(publicKey1, publicKey2));
        }
        else {
            return keccak256(abi.encode(publicKey2, publicKey1));
        }
    }

    function sendMessage(string memory msgData, address friend_publickey ) external {
        require(_checkUserExists(msg.sender), "Please Register to send messages");
        require(_checkUserExists(friend_publickey), "The Person you have intended to Send Is not yet regsitered");
        require(_alreadyFriends(msg.sender, friend_publickey), "You are not a friend of that person, Please send Friend Request to that person");
        bytes32 sessionKey = _sessionKey(msg.sender, friend_publickey);
        message memory newMsg = message(msg.sender, msgData, block.timestamp);
        messages[sessionKey].push(newMsg);
    }

    function readMessage(address friend_pubkey) external view returns(message[] memory) {
        bytes32 chatCode = _sessionKey(msg.sender, friend_pubkey);
        return messages[chatCode];
    }
}