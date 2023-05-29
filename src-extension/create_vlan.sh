#!/bin/bash

# ----------------------------------------------------------------------------
#   ____________ ______ _  _______             _____  _  __   ____   _____
#  |___  /  ____|  ____| |/ /  __ \      /\   |  __ \| |/ /  / __ \ / ____|
#     / /| |__  | |__  | ' /| |__) |    /  \  | |__) | ' /  | |  | | (___
#    / / |  __| |  __| |  < |  _  /    / /\ \ |  _  /|  <   | |  | |\___ \
#   / /__| |____| |____| . \| | \ \   / ____ \| | \ \| . \  | |__| |____) |
#  /_____|______|______|_|\_\_|  \_\ /_/    \_\_|  \_\_|\_\  \____/|_____/
#
# Copyright (c) 2022-present, ZEEKR Inc. All rights reserved.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
# ----------------------------------------------------------------------------

##############  Variables  #############
need_create_vlan=""

##############   LOG  ###################
function error() {
  echo "$(tput setaf 1)ERROR: $1$(tput sgr0)"  >&2
}

function green() {
  echo "$(tput setaf 2)$1$(tput sgr0)"
}

############## Function #################

function create_vlan() {
    local ip=${1}
    local mask=${2}

    __prepare_env
    local physical_card=$(ip addr show  | grep "enp" | cut -d ":" -f2)
    if [ $? -eq 0 ] && [ "x${physical_card}" != "x" ]; then
        sudo vconfig add ${physical_card} 204
        sudo vconfig set_flag ${physical_card}.204 1 1
        sudo ifconfig ${physical_card}:204 ${ip} netmask ${mask} up
        sudo route add -net 239.0.204.0 netmask 255.255.255.0 dev ${physical_card}.204
    fi
}

function del_vlan()
{
    local vcard=$(ifconfig | grep "enp.*204" | grep -oE '^[^:]+:[^:]+')
    if [ $? -eq 0 ] && [ "x${vcard}" != "x" ]; then
        sudo ip link set dev ${vcard} down
        sudo ip link delete ${vcard}
    fi
}

function __prepare_env()
{
    sudo apt-get install vlan -y
}

function __ip_to_binary() {
    local ip=${1}
    local binary=""

    # 将IP地址按"."分割为四部分，并转换为二进制形式
    IFS="." read -ra octets <<< "$ip"
    for octet in "${octets[@]}"; do
        binary+="$(printf "%08d" "$(bc <<< "obase=2;$octet")")"
    done

    echo "$binary"
}

function __need_create_vlan()
{
    local input_ip=$(__ip_to_binary ${1})
    local input_mask=$(__ip_to_binary ${2})

    local docker_name=$(ifconfig | grep docker0 | cut -d ":" -f1)
    if [ $? -eq 0 ] && [ "${docker_name}" == "docker0" ]; then
        local docker_ip=$(ifconfig ${docker_name} | grep -Eo 'inet [^ ]+' | awk '{print $2}')
        local docker_mask=$(ifconfig ${docker_name} | grep -Eo 'netmask [^ ]+' | awk '{print $2}')
        local docker_ip_binary=$(__ip_to_binary "${docker_ip}")
        local docker_mask_binary=$(__ip_to_binary "${docker_mask}")
        if [[ $((2#"$input_ip" & 2#"$input_mask")) == $((2#"$docker_ip_binary" & 2#"$docker_mask_binary")) ]]; then
            green "输入的IP地址与 ${docker_name} 处于同一个局域网,无需创建VLAN"
            return 0
        fi
    fi

    need_create_vlan="true"
}

#################  Main  ######################

# check the options
case "$1" in
    enable)
    __need_create_vlan ${2} ${3}
    green "checkresult:  ${need_create_vlan}"
    [ "x${need_create_vlan}" != "x" ] && create_vlan ${2} ${3}
    exit 0
    ;;

    disable)
    del_vlan
    exit 0
    ;;
    *)
    error "param is error"
esac