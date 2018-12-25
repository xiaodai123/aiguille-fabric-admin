<template>
    <div channel_manage>
        <section>
            <span class="cm_line">
                <span>Channel管理</span>
            </span>
            <hr class="cm_dotted">
        </section>
        <section class="query-section">
            <el-form label-position="right" label-width="100px" size="small" :model="channelQuery">
                <el-row :gutter="8">
                    <el-col :span="8">
                        <el-form-item label="Orderer名称">
                            <el-select clearable v-model="channelQuery.ordererName" placeholder="请选择Orderer名称">
                                <el-option v-for="(orderer, index) in ordererData" :key="index" :label="orderer.name" :value="orderer.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Peer名称">
                            <el-select clearable v-model="channelQuery.peerName" placeholder="请选择Peer名称">
                                <el-option v-for="(peer, index) in peerData" :key="index" :label="peer.name" :value="peer.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <div style="text-align: center;">
                                 <el-button type="primary" @click="getChannelList" size="mini" round>查询</el-button>
                                 <el-button type="primary" @click="openChannelDialog('ADD')" size="mini" round>新增</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="channelData">
                <!-- <el-table-column width="50" prop="channelId" align="center" label="ID"></el-table-column> -->
                <el-table-column align="center" type="index" width="50" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operChannelInfo(scope.row.channelId, 'INFO')">{{scope.row.channelName}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="90" prop="peerCount" align="center" label="Peer节点数"></el-table-column>
                <el-table-column width="90" prop="ordererCount" align="center" label="排序节点数"></el-table-column>
                <el-table-column width="350" prop="remark" align="center" label="描述"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column width="220" align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operChannelInfo(scope.row.channelId, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delChannelInfo(scope.row.channelId)" size="mini">删除</el-button>
                            <el-button v-if="!scope.row.construct" type="primary" @click="constructChannel(scope.row.channelId)" size="mini">构造</el-button>
                            <el-button v-if="scope.row.construct" type="primary" @click="reConstructChannel(scope.row.channelId)" size="mini">初始化</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="total, prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="channelInfo" ref="channelForm" :rules="channelRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="channelInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="leagueName" label="联盟名称">
                            <el-input :disabled="operType == 'INFO'" v-model="channelInfo.leagueName" placeholder="请输入联盟名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="tx路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="channelInfo.txPath" placeholder="请输入tx路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Orderer">
                            <el-select :disabled="operType == 'INFO'" clearable multiple filterable value-key="id" v-model="channelInfo.ordererList" placeholder="请选择Orderer">
                                <el-option v-for="(orderer, index) in ordererData" :key="index" :label="orderer.name" :value="orderer"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Peer">
                            <el-select :disabled="operType == 'INFO'" clearable multiple filterable value-key="id" v-model="channelInfo.peerList" placeholder="请选择Peer">
                                <el-option v-for="(peer, index) in peerData" :key="index" :label="peer.name" :value="peer"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="construct" label="通道是否已构造">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="channelInfo.construct"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="blockListener" label="是否监听区块">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="channelInfo.blockListener"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="channelInfo.blockListener">
                    <el-col :span="24">
                        <el-form-item prop="callbackLocation" label="回调地址">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="channelInfo.callbackLocation" placeholder="请输入回调地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="height" label="账本高度">
                            <el-input-number :disabled="operType == 'INFO'" v-model="channelInfo.height" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="remark" label="描述">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="channelInfo.remark" placeholder="请输入描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitChannelInfo" size="small">提交</el-button>
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
            ordererData: [],
            peerData: [],
            channelQuery: {
                ordererName: '',
                peerName: ''
            },
            channelData: [],
            dialogVisible: false,
            title: '新增Channel',
            operType: 'ADD',
            channelRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                // location: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            channelInfo: {
                id: -1,
                name: '',//名称
                leagueName: '',
                txPath: '',
                ordererList: [],
                peerList: [],
                construct: false,
                blockListener: true,
                callbackLocation: '',
                height: 0,
                remark: ''
            },
            pageInfo: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                total: 0
            }
        }
    },
    mounted() {
        this.getChannelList();
        this.getOrdererList();
        this.getPeerList();
    },
    methods: {
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getChannelList();
        },
        constructChannel(id) {
            this.$post(AIGUILLE_FABRIC + '/channel/constructChannel', { id }, d => {
                if(d.code == '0000') {
                    this.$message({ message: d.message, type: 'success' });
                    this.getChannelList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        reConstructChannel(id) {
            this.$post(AIGUILLE_FABRIC + '/channel/reConstructChannel', { id }, d => {
                if(d.code == '0000') {
                    this.$message({ message: d.message, type: 'success' });
                    this.getChannelList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getPeerList() {
            this.$get(AIGUILLE_FABRIC + '/peer/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.peerData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getOrdererList() {
            this.$get(AIGUILLE_FABRIC + '/orderer/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.ordererData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getCaList() {
            this.$get(AIGUILLE_FABRIC + '/ca/getCaList', {}, d => {
                if(d.code == '0000') {
                    this.caData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        resetForm() {
            this.channelInfo.id = -1;
            this.channelInfo.name = '';//名称
            this.channelInfo.txPath = '';
            this.channelInfo.ordererList = [];
            this.channelInfo.peerList = [];
            this.channelInfo.leagueName = '';
            this.channelInfo.construct = false;
            this.channelInfo.blockListener = true;
            this.channelInfo.callbackLocation = '';
            this.channelInfo.height = 0;
            this.channelInfo.remark = '';
        },
        getChannel(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/channel/getChannel', { channelId: id }, d => {
                    if(d.code == '0000') {
                        this.channelInfo.id = d.data.id;
                        this.channelInfo.name = d.data.name;//名称
                        this.channelInfo.txPath = d.data.txPath;
                        this.channelInfo.ordererList = d.data.ordererList || [];
                        this.channelInfo.peerList = d.data.peerList || [];
                        this.channelInfo.leagueName = d.data.leagueName || '';
                        this.channelInfo.construct = d.data.construct;
                        this.channelInfo.blockListener = d.data.blockListener;
                        this.channelInfo.callbackLocation = d.data.callbackLocation;
                        this.channelInfo.height = d.data.height;
                        this.channelInfo.remark = d.data.remark;
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operChannelInfo(id, operType) {
            this.resetForm();
            this.getChannel(id).then(() => {
                this.openChannelDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delChannelInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/channel/deleteChannel', { id }, d => {
                    if(d.code == '0000') {
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.$message({ message: d.message, type: 'success' });
                        this.getChannelList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitChannelInfo() {
            let channelInfo = JSON.parse(JSON.stringify(this.channelInfo));
            let url = 'insertChannel';
            if(this.operType == 'MOD') {
                url = 'updateChannel';
            }
            this.$refs.channelForm.validate((valid) => {
                if(valid) {
                    if(typeof channelInfo.height == 'undefined') {
                        channelInfo.height = 0;
                    }
                    let ordererList = channelInfo.ordererList || [];
                    ordererList.forEach(item => {
                        item.id = item.ordererId;
                    })
                    let peerList = channelInfo.peerList || [];
                    peerList.forEach(item => {
                        item.id = item.peerId;
                        item.role = item.roleCode;
                    })
                    this.$post(AIGUILLE_FABRIC + '/channel/' + url, channelInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getChannelList();
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
        openChannelDialog(operType) {
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改Channel';
            }else if(operType == 'ADD') {
                this.title = '新增Channel';
                this.resetForm();
            }else{
                this.title = 'Channel详情';
            }
            this.dialogVisible = true;
        },
        getChannelList() {
            let channelQuery = JSON.parse(JSON.stringify(this.channelQuery));
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            channelQuery.pageNum = this.pageInfo.pageNum;
            channelQuery.pageSize = this.pageInfo.pageSize;
            this.$get(AIGUILLE_FABRIC + '/channel/findAllByPage', channelQuery, d => {
                if(d.code == '0000') {
                    this.channelData = d.data.list;
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
div[channel_manage] {
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
