export const zkSyncMessagingDAppAddress: string = "0x04d45381653F615d34EE6dFa317f0172014058E5";
export const zkSyncMessagingDAppABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "friendName",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "friend_address",
                "type": "address"
            }
        ],
        "name": "addFriend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            }
        ],
        "name": "createUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllUsers",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "publicAddress",
                        "type": "address"
                    }
                ],
                "internalType": "struct zkSyncMessagingDApp.completeUser[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMyFriends",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "publicAddress",
                        "type": "address"
                    }
                ],
                "internalType": "struct zkSyncMessagingDApp.friend[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "publicAddress",
                "type": "address"
            }
        ],
        "name": "getUserName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "friend_pubkey",
                "type": "address"
            }
        ],
        "name": "readMessage",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "msgSenderPubKey",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "msgData",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct zkSyncMessagingDApp.message[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "msgData",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "friend_publickey",
                "type": "address"
            }
        ],
        "name": "sendMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
