<template>
    <div peer_manage>
        <section>
            <span class="cm_line">
                <span>Peer管理</span>
            </span>
            <hr class="cm_dotted">
        </section>
        <section class="query-section">
            <el-form label-position="right" label-width="80px" size="small" :model="peerQuery">
                <el-row :gutter="8">
                    <el-col :span="18">
                        <!-- <el-form-item label="通道名称">
                            <el-input style="width: 33%;" clearable v-model="peerQuery.channelName" placeholder="请填写通道名称"></el-input>
                        </el-form-item> -->
                        <el-form-item label="通道名称">
                            <el-select style="width: 33%;" clearable v-model="peerQuery.channelName" placeholder="请选择通道名称">
                                <el-option v-for="(channel, index) in channelData" :key="index" :label="channel.name" :value="channel.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <div style="text-align: center;">
                                 <el-button type="primary" @click="getPeerList" size="mini" round>查询</el-button>
                                 <el-button type="primary" @click="openPeerDialog('ADD')" size="mini" round>新增</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="peerData">
                <el-table-column prop="peerId" align="center" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operPeerInfo(scope.row.peerId, 'INFO')">{{scope.row.peerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" align="center" label="访问地址"></el-table-column>
                <el-table-column prop="roleName" align="center" label="角色"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operPeerInfo(scope.row.peerId, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delPeerInfo(scope.row.peerId)" size="mini">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="150px" :model="peerInfo" ref="peerForm" :rules="peerRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="peerInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="location" label="访问地址">
                            <el-input :disabled="operType == 'INFO'" v-model="peerInfo.location" placeholder="请输入访问地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="eventHubLocation" label="Event-Hub-Location">
                            <el-input :disabled="operType == 'INFO'" v-model="peerInfo.eventHubLocation" placeholder="请输入Event-Hub-Location"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="role" label="角色">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="peerInfo.role" placeholder="请选择角色">
                                <el-option v-for="(role, index) in roleData" :key="index" :label="role.name" :value="role.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="orgId" label="组织">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="peerInfo.orgId" placeholder="请选择组织">
                                <el-option v-for="(org, index) in orgData" :key="index" :label="org.name" :value="org.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="服务端证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="peerInfo.serverCrtPath" placeholder="请输入服务端证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="客户端证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="peerInfo.clientCertPath" placeholder="请输入客户端证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="客户端私钥路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="peerInfo.clientKeyPath" placeholder="请输入客户端私钥路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitPeerInfo" size="small">提交</el-button>
                <el-button type="primary" @click="dialogVisible = false" size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { MessageBox } from 'element-ui';
import { AIGUILLE_FABRIC, PAGE_SIZE } from '~compJs/const';
export default {
    data() {
        return {
            channelData: [],
            roleData: [],
            orgData: [],
            peerQuery: {
                channelName: ''
            },
            peerData: [],
            dialogVisible: false,
            title: '新增Peer',
            operType: 'ADD',
            peerRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                location: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            peerInfo: {
                id: -1,
                location: '',//访问地址
                name: '',//名称
                eventHubLocation: '',
                role: '',
                orgId: '',
                serverCrtPath: '',//服务端证书路径
                clientCertPath: '',//客户端证书路径
                clientKeyPath: ''//客户端私钥路径
            },
            pageInfo: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                total: 0
            }
        }
    },
    mounted() {
        this.getPeerList();
        this.getChannelList();
    },
    methods: {
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getPeerList();
        },
        getChannelList() {
            this.$get(AIGUILLE_FABRIC + '/channel/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.channelData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getRoleList() {
            this.$get(AIGUILLE_FABRIC + '/sysConfig/getRoleConfig', { typeEnum: 'peerRole' }, d => {
                if(d.code == '0000') {
                    this.roleData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getOrgList() {
            this.$get(AIGUILLE_FABRIC + '/org/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.orgData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        resetForm() {
            this.peerInfo.id = -1;
            this.peerInfo.location = '';//访问地址
            this.peerInfo.name = '';//名称
            this.peerInfo.serverCrtPath = '';//服务端证书路径
            this.peerInfo.orgId = '';
            this.peerInfo.eventHubLocation = '';
            this.peerInfo.role = '';
            this.peerInfo.clientCertPath = '';
            this.peerInfo.clientKeyPath = '';
        },
        getPeer(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/peer/getPeer', { peerId: id }, d => {
                    if(d.code == '0000') {
                        this.peerInfo.id = d.data.peerId;
                        this.peerInfo.location = d.data.location;//访问地址
                        this.peerInfo.name = d.data.peerName;//名称
                        this.peerInfo.orgId = d.data.orgId;
                        this.peerInfo.role = d.data.roleCode;
                        this.peerInfo.eventHubLocation = d.data.eventHubLocation;
                        this.peerInfo.clientCertPath = d.data.clientCertPath;
                        this.peerInfo.clientKeyPath = d.data.clientKeyPath;
                        this.peerInfo.serverCrtPath = d.data.serverCrtPath;
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operPeerInfo(id, operType) {
            this.resetForm();
            this.getPeer(id).then(() => {
                this.openPeerDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delPeerInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/peer/deletePeer', { id }, d => {
                    if(d.code == '0000') {
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.$message({ message: d.message, type: 'success' });
                        this.getPeerList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitPeerInfo() {
            let peerInfo = JSON.parse(JSON.stringify(this.peerInfo));
            let url = 'insertPeer';
            if(this.operType == 'MOD') {
                url = 'updatePeer';
            }
            this.$refs.peerForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/peer/' + url, peerInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getPeerList();
                            this.resetForm();
                            this.dialogVisible = false;
                        }else {
                            // this.$box({title: '提示', message: d.message, type: 'fail'});
                            this.$message({ message: d.message, type: 'error' });
                        }
                    })
                }
            })
        },
        openPeerDialog(operType) {
            this.getOrgList();
            this.getRoleList();
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改Peer';
            }else if(operType == 'ADD') {
                this.title = '新增Peer';
                this.resetForm();
            }else{
                this.title = 'Peer详情';
            }
            this.dialogVisible = true;
        },
        getPeerList() {
            let peerQuery = JSON.parse(JSON.stringify(this.peerQuery));
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            peerQuery.pageNum = this.pageInfo.pageNum;
            peerQuery.pageSize = this.pageInfo.pageSize;
            this.$get(AIGUILLE_FABRIC + '/peer/findAllByPage', peerQuery, d => {
                if(d.code == '0000') {
                    this.peerData = d.data.list;
                    this.pageInfo.total = d.data.total;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        }
    }
}
</script>
<style lang="scss">
div[peer_manage] {
    .query-section {
        border: 1px solid #ebebeb;
        border-radius: 3px;
        margin-bottom: 20px;
        padding: 20px;
    }
    .el-select {
        width: 100%;
    }
}
</style>
