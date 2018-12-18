<template>
    <div orderer_manage>
        <section>
            <span class="cm_line">
                <span>Orderer管理</span>
            </span>
            <hr class="cm_dotted">
        </section>
        <section class="query-section">
            <el-form label-position="right" label-width="80px" size="small" :model="ordererQuery">
                <el-row :gutter="8">
                    <el-col :span="18">
                        <el-form-item label="通道名称">
                            <el-select style="width: 33%;" clearable v-model="ordererQuery.channelName" placeholder="请选择通道名称">
                                <el-option v-for="(channel, index) in channelData" :key="index" :label="channel.name" :value="channel.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <div style="text-align: center;">
                                 <el-button type="primary" @click="getOrdererList" size="mini" round>查询</el-button>
                                 <el-button type="primary" @click="openOrdererDialog('ADD')" size="mini" round>新增</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="ordererData">
                <el-table-column prop="ordererId" align="center" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operOrdererInfo(scope.row.ordererId, 'INFO')">{{scope.row.ordererName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" align="center" label="访问地址"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operOrdererInfo(scope.row.ordererId, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delOrdererInfo(scope.row.ordererId)" size="mini">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="ordererInfo" ref="ordererForm" :rules="ordererRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="ordererInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="location" label="访问地址">
                            <el-input :disabled="operType == 'INFO'" v-model="ordererInfo.location" placeholder="请输入访问地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="caId" label="CA服务器">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="ordererInfo.caId" placeholder="请选择CA服务器">
                                <el-option v-for="(ca, index) in caData" :key="index" :label="ca.name" :value="ca.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="服务端证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="ordererInfo.serverCrtPath" placeholder="请输入服务端证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="客户端证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="ordererInfo.clientCertPath" placeholder="请输入客户端证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="客户端私钥路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="ordererInfo.clientKeyPath" placeholder="请输入客户端私钥路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitOrdererInfo" size="small">提交</el-button>
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
            caData: [],
            ordererQuery: {
                channelName: ''
            },
            ordererData: [],
            dialogVisible: false,
            title: '新增Orderer',
            operType: 'ADD',
            ordererRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                location: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            ordererInfo: {
                id: -1,
                location: '',//访问地址
                name: '',//名称
                caId: '',//CA服务器
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
        this.getOrdererList();
        this.getChannelList();
    },
    methods: {
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getOrdererList();
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
        getCaList() {
            this.$get(AIGUILLE_FABRIC + '/ca/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.caData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        resetForm() {
            this.ordererInfo.id = -1;
            this.ordererInfo.location = '';//访问地址
            this.ordererInfo.name = '';//名称
            this.ordererInfo.serverCrtPath = '';//服务端证书路径
            this.ordererInfo.caId = '';
            this.ordererInfo.clientCertPath = '';
            this.ordererInfo.clientKeyPath = '';
        },
        getOrderer(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/orderer/getOrderer', { ordererId: id }, d => {
                    if(d.code == '0000') {
                        this.ordererInfo.id = d.data.ordererId;
                        this.ordererInfo.location = d.data.location;//访问地址
                        this.ordererInfo.name = d.data.ordererName;//名称
                        this.ordererInfo.caId = d.data.caId;
                        this.ordererInfo.clientCertPath = d.data.clientCertPath;
                        this.ordererInfo.clientKeyPath = d.data.clientKeyPath;
                        this.ordererInfo.serverCrtPath = d.data.serverCrtPath;
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operOrdererInfo(id, operType) {
            this.resetForm();
            this.getOrderer(id).then(() => {
                this.openOrdererDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delOrdererInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/orderer/deleteOrderer', { id }, d => {
                    if(d.code == '0000') {
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.$message({ message: d.message, type: 'success' });
                        this.getOrdererList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitOrdererInfo() {
            let ordererInfo = JSON.parse(JSON.stringify(this.ordererInfo));
            let url = 'insertOrderer';
            if(this.operType == 'MOD') {
                url = 'updateOrderer';
            }
            this.$refs.ordererForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/orderer/' + url, ordererInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getOrdererList();
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
        openOrdererDialog(operType) {
            this.getCaList();
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改Orderer';
            }else if(operType == 'ADD') {
                this.title = '新增Orderer';
                this.resetForm();
            }else{
                this.title = 'Orderer详情';
            }
            this.dialogVisible = true;
        },
        getOrdererList() {
            let ordererQuery = JSON.parse(JSON.stringify(this.ordererQuery));
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            ordererQuery.pageNum = this.pageInfo.pageNum;
            ordererQuery.pageSize = this.pageInfo.pageSize;
            this.$get(AIGUILLE_FABRIC + '/orderer/findAllByPage', ordererQuery, d => {
                if(d.code == '0000') {
                    this.ordererData = d.data.list;
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
div[orderer_manage] {
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
