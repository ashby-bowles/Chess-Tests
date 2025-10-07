#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Use the correct Node version
nvm use

# Verify Node is working
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Node path: $(which node)"









