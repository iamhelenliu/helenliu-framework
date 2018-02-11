cd "$(dirname "$0")"
if [ ! -d node_modules ];then
  npm install
fi
sudo npm install -g npm-check-updates
npm install gulp --save-dev
ncu
gulp