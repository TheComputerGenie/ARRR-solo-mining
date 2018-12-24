## Solomining proxy for Komodo `ac_private` coins like PIRATE. (READY FOR TESTING)

## When all else fails: RTFM!

Requirements
------------
* node v11.5+ (installs by following "Install" below)
* coin daemon [`komodod -ac_name=PIRATE -ac_supply=0 -ac_reward=25600000000 -ac_halving=77777 -ac_private=1`]

Install
-------------

```bash
sudo apt-get install build-essential libsodium-dev npm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bashrc
npm install npm -g
nvm install node
nvm alias default node
git clone https://github.com/TheComputerGenie/ARRR-solo-mining
cd ARRR-solo-mining
npm install && cd node_modules/express-dot-engine && npm install lodash@4.17.11 && cd ../..
```

Configure
-------------
Go to config.json and change it to your setup.
rewardRecipients needs to be set as:
```
    "rewardRecipients": {
        "RK4nbXDMFnaxNF6Wa5T1kjoTdGTpxMmLAL": 2
    },
```
or
```
    "rewardRecipients": {
    },
```
`do not` set as ""

Run
------------
```bash
npm start
```

Update
------------- 
```bash
git pull
rm -rf node_modules
npm install
```

Differences between this and Z-NOMP
------------
* This is meant for solo mining
* There is no share system; Every "share" is the block solution
* No payments
* Manual shielding required (for now)

Notes and known issues:
------------
* (KI) You can only have recipients or collect fees. This is `not` a pool issue, this is inherent in the Komodo code.
If there is more than 1 vout on an `ac_private` chain, then Komodo disallows the coinbase total to be greater than the
base block reward. There's nothing that can be done about this at a pool level.

* (KI) 'Daemon is still syncing with network' is broken (fully sync chain before running pol), as is VarDiff.

* (N KI) As noted above, shielding is currently manual only. This means that your coinage will sit in your transparent
address untill you run `z_shieldcoinbase` with the daemon cli. An automation of this will be added in the future.

* (N) If the code looks like it has 9 styles of writing, that because it does. It was a long journey from NOMP to here with
many hands in the jar and no "standard" of style. Over time, the base has become the spagetti that NOMP was written to
avoid, and over time that will be changed.

* (KI) Block logger logs everything. If multiple valid blocks are found before a given height is validated, the logger will
 log them all (which, in turn, means that "duplicates" will show on the website, but if you look at the actual output
 you will see that they are, in fact, different hashes and different valid block solutions). This is an issue with
 extremely low diff chains and may or may not be addressed at a later date.

* (N KI) Web pages use online resources for css and some of the js. These min files are "standard", used on countless sites, 
can be checked at your discretion, and may or may not be localized at some future point.

* There is no TLS functionality, because I'm not sure I could ever be convinced of need for a solo setup.

License
-------
Released under the GNU General Public License 3
http://www.gnu.org/licenses/gpl-3.0.html

_Forked from [aayanl/equihash-solomining](https://github.com/aayanl/equihash-solomining) which is licensed under GNU GPL v2_
