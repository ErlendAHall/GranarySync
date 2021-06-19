compiledName="granarysync.js"
root="/granary/edev/GranarySync"

# Bundle to a single source.
deno bundle $root/init.js $root/$compiledName


# Set permissions and move it executing location
echo "setting permissions"
sudo mkdir -p /usr/local/bin/granarysync
sudo chown root:root $root/$compiledName
sudo chmod 700 $root/$compiledName
sudo mv $root/$compiledName /usr/local/bin/granarysync/
