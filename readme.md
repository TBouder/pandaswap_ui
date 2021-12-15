# 🏹 Bowswap

## Setup  

1. Install the dependencies with `yarn`  
2. Create a `.env` file in the root directory with
```
ALCHEMY_KEY=YOUR_ALCHEMY_KEY
```  
3. Start the dev project with `yarn run dev`
4. [Go check the swap](http://localhost:3000)

## How to generate the paths
Bowswap works by generating a path for each possible swap. Detecting the correct swap from one vault to another require some backtracking to try to find the correct, most optimal path.   
Because of the number of possibilities, this is a very expensive operation.  
`From` and `To` will always be Yearn Vaults, fetched directly from the Yearn API here: [https://api.yearn.finance/v1/chains/1/vaults/all](https://api.yearn.finance/v1/chains/1/vaults/all).  
The possible paths (or *listing*) correspond to the possible pools from Curve Finance we could use to move from one specific LP token to another until we reach the underlying token of the `To` vault. The pools used are not limited to the one used in Yearn vaults, but integrates all the pools from Curve Finance, including the factory pools (ibBtc, ibEur for example).  
All commands must be run in the root directory of the project.  
Here are the steps to generate the paths. *This can take a while*.

1. Update the listings we can use. This can be updated every time a new curve pool is created to try to find new paths.
```
npx hardhat run scripts/detect_listing.js > scripts/detected_listing.json
```
This will create a new json file with the detected listings. This will be used in next scripts.

2. The first feature of Bowswap is `metapool_swaps`. This is a way to swap 2 tokens belonging to the same metapool.
```
npx hardhat run scripts/detect_metapoolSwaps.js > utils/detected_metapoolSwaps.json
```
The paths are generated by fetching all the vaults from Yearn and using the `expect` function from hardhat to try to perform the swap in a local fork with safe conditions. If the swap is successful, the path is saved in the `utils/detected_metapoolSwaps.json` file.

3. The second and main feature of Bowswap is the `swap` command. This command will try to find the best path to swap the tokens.
```
npx hardhat run scripts/detect_swaps.js > scripts/detected_swaps.json
```
This is the big backtracking function that will try to find the valid path. Depending on the depth (see Line ~217 : `for (let max = 0; max < 7; max++) {` where `7` is depth) it can be very slow. A new file will be created in the `scripts` folder and will be used the next script.

4. A new feature was introduced to perform actual swap when possible and save 1 operation when possible. You can use this script to update the `detected_swaps.json` file.
```
node scripts/upgrade_swaps.js > utils/detected_swaps.json
```

## Tests
You can test the paths with :   
- `npx hardhat test test/00_metapoolswaps.js`  
- `npx hardhat test test/01_swaps.js`  

## Links
- [Yearn](http://yearn.finance/) 
- [yCRV Metapool Swapper](https://github.com/pandadefi/y-crv-metapool-swapper) by @pandadefi
