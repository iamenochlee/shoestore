// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ShoeStore {
    //a shoe with all feature it will have
    struct Shoe {
        uint id;
        string name;
        string brand;
        uint size;
        address owner;
        uint price;
        string image;
        bool isListed;
    }

    //an history struct for purchases
    struct History {
        uint id;
        string name;
        string brand;
        uint price;
        string txType;
        uint time;
    }
    // an array to store all the shoes
    Shoe[] public shoes;

    //a mapping to store the history of a user
    mapping(address => History[]) userHistory;

    //a mapping to store the admins of the shoestore
    mapping(address => bool) public admins;

    //the rate this marketplace will charge once a shoe is purchased.
    uint128 public commissionRate;

    uint32 public listedShoesCount = 0;

    //events: when a shoe is created
    event ShoeCreated(
        uint id,
        string name,
        string brand,
        uint size,
        address owner,
        uint price,
        string _image
    );

    //events: when a shoe is listed for purchase
    event ShoeListed(
        uint indexed shoeIndex,
        string name,
        string brand,
        uint size,
        address owner,
        uint price,
        string image
    );

    //events: when a shoe is delsited
    event ShoeDelisted(uint indexed shoeIndex);

    //events: when a shoe is bought
    event ShoeBought(
        uint indexed shoeIndex,
        address indexed buyer,
        address indexed seller,
        uint price
    );

    //modifier: checks if a caller is an admin
    modifier onlyAdmins() {
        require(admins[msg.sender], "You are not Permitted");
        _;
    }

    /// constructor: set the owner to the deployer of the contract
    /// the commissionRate to 1%
    /// also sets an admin
    /// @param _admin address of an admi
    constructor(address _admin) {
        admins[msg.sender] = true;
        admins[_admin] = true;
        commissionRate = 1;
    }

    /// This creates a new Shoe and adds it to the shoe Array also
    /// emits event of a shoe created
    /// @param _name the name of the shoe
    /// @param _brand the shoe brand
    /// @param _size the size
    /// @param _price  the price of the shoe, must be > 0
    /// @param _image  a picture of the shoe
    function createShoe(
        string memory _name,
        string memory _brand,
        uint256 _size,
        uint256 _price,
        string memory _image
    ) public onlyAdmins {
        require(_price > 0, "Price must be greater than 0");
        uint id = shoes.length;
        shoes.push(
            Shoe(id, _name, _brand, _size, msg.sender, _price, _image, false)
        );
        emit ShoeCreated(id, _name, _brand, _size, msg.sender, _price, _image);
        userHistory[msg.sender].push(
            History({
                id: id,
                name: _name,
                brand: _brand,
                price: _price,
                txType: "create",
                time: block.timestamp
            })
        );
    }

    /// This is called to change the price of shoe
    /// @param _shoeId the shoe id
    /// @param _price the new price
    function changeShoePrice(uint _shoeId, uint _price) public {
        require(_shoeId >= 0 && _shoeId < shoes.length, "Invalid shoe ID");
        require(shoes[_shoeId].owner == msg.sender, "You do not own this shoe");
        shoes[_shoeId].price = _price;
    }

    /// This lists a shoe for sale on the marketplace
    /// Only a shoeOwner can list a shoe
    /// It emits an ivent on shoe Liting
    /// @param _shoeId the id of the shoe
    function listShoe(uint256 _shoeId) public {
        require(_shoeId >= 0 && _shoeId < shoes.length, "Invalid shoe ID");
        require(shoes[_shoeId].owner == msg.sender, "You do not own this shoe");
        require(!shoes[_shoeId].isListed, "Shoe is already listed");
        shoes[_shoeId].isListed = true;
        listedShoesCount++;
        emit ShoeListed(
            _shoeId,
            shoes[_shoeId].name,
            shoes[_shoeId].brand,
            shoes[_shoeId].size,
            msg.sender,
            shoes[_shoeId].price,
            shoes[_shoeId].image
        );
    }

    /// This delists a shoe for sale on the marketplace
    /// Only a shoeOwner can list a shoe
    /// It emits an ivent on shoe Liting
    /// @param _shoeId the id of the shoe
    function delistShoe(uint256 _shoeId) public {
        require(_shoeId >= 0 && _shoeId < shoes.length, "Invalid shoe ID");
        require(shoes[_shoeId].owner == msg.sender, "You do not own this shoe");
        require(shoes[_shoeId].isListed, "Shoe is not listed");
        shoes[_shoeId].isListed = false;
        listedShoesCount--;
        emit ShoeDelisted(_shoeId);
    }

    /// This function is called to purchase a shoe
    /// it transfers owner of the shoe to the buyer adds a new puchase History
    /// it removes commission of 1% and sends the remainning to the seller
    /// @param _shoeId the id of the shoe
    function buyShoe(uint256 _shoeId) public payable {
        require(_shoeId >= 0 && _shoeId < shoes.length, "Invalid shoe ID");
        require(shoes[_shoeId].isListed == true, "This shoe is not for sale");
        require(msg.value >= shoes[_shoeId].price, "Insufficient funds");
        address payable seller = payable(shoes[_shoeId].owner);
        seller.transfer((shoes[_shoeId].price * (100 - commissionRate)) / 100);
        shoes[_shoeId].owner = msg.sender;
        shoes[_shoeId].isListed = false;
        listedShoesCount--;
        userHistory[msg.sender].push(
            History({
                id: _shoeId,
                name: shoes[_shoeId].name,
                brand: shoes[_shoeId].brand,
                price: shoes[_shoeId].price,
                txType: "bought",
                time: block.timestamp
            })
        );
        userHistory[seller].push(
            History({
                id: _shoeId,
                name: shoes[_shoeId].name,
                brand: shoes[_shoeId].brand,
                price: shoes[_shoeId].price,
                txType: "sold",
                time: block.timestamp
            })
        );
        emit ShoeBought(_shoeId, msg.sender, seller, shoes[_shoeId].price);
    }

    /// This fetches all the shoe owner by an address
    /// @param _owner the address of the shoe owner
    function getAllUserShoes(
        address _owner
    ) public view returns (Shoe[] memory) {
        Shoe[] memory shoesMem = shoes;
        uint32 count = 0;
        for (uint i = 0; i < shoes.length; i++) {
            if (shoes[i].owner == _owner) {
                count++;
            }
        }
        Shoe[] memory userShoes = new Shoe[](count);
        uint index = 0;
        for (uint i = 0; i < shoes.length; i++) {
            if (shoesMem[i].owner == _owner) {
                userShoes[index] = shoesMem[i];
                index++;
            }
        }
        return userShoes;
    }

    /// This fetches all the listed shoes
    function getAllListedShoes() public view returns (Shoe[] memory) {
        Shoe[] memory result = new Shoe[](listedShoesCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < shoes.length; i++) {
            if (shoes[i].isListed == true) {
                result[idx] = shoes[i];
                idx++;
            }
        }
        return result;
    }

    /// This fetches all user purchases history
    function getUserHistory(
        address _owner
    ) public view returns (History[] memory) {
        return userHistory[_owner];
    }

    /// This is called to withdraw all the balance of the contract
    /// gotten from shoe purchaes to the owner
    function withdraw() external onlyAdmins {
        payable(address(msg.sender)).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
