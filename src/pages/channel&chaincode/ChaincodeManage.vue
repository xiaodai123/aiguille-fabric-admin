<template>
    <div chaincode_manage>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">Chaincode管理</span>
                <el-button type="primary" @click="openChaincodeDialog('ADD')" size="mini" round>新增</el-button>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="chaincodeData">
                <el-table-column width="50" prop="id" align="center" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operChaincodeInfo(scope.row.id, 'INFO')">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="version" align="center" label="版本"></el-table-column>
                <el-table-column width="350" prop="remark" align="center" label="描述"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column width="220" align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operChaincodeInfo(scope.row.id, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delChaincodeInfo(scope.row.id)" size="mini">删除</el-button>
                            <el-button v-if="!scope.row.install" type="primary" @click="installChaincode(scope.row.id)" size="mini">安装</el-button>
                            <el-button v-if="!scope.row.instantiate && scope.row.install" type="primary" @click="instantiateChaicode(scope.row.id)" size="mini">初始化</el-button>
                            <el-button v-if="!scope.row.upgrade && scope.row.instantiate && scope.row.install" type="primary" @click="upgradeChaicode(scope.row.id)" size="mini">升级</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="total, prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="130px" :model="chaincodeInfo" ref="chaincodeForm" :rules="chaincodeRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="chaincodeInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="version" label="版本">
                            <el-input :disabled="operType == 'INFO'" v-model="chaincodeInfo.version" placeholder="请输入版本"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="语言">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="chaincodeInfo.language" placeholder="请选择语言">
                                <el-option v-for="(lang, index) in langData" :key="index" :label="lang.name" :value="lang.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="businessCode" label="业务代码">
                            <el-input :disabled="operType == 'INFO'" v-model="chaincodeInfo.businessCode" placeholder="请输入业务代码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="通道">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="chaincodeInfo.channelId" placeholder="请选择通道">
                                <el-option v-for="(channel, index) in channelData" :key="index" :label="channel.name" :value="channel.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="sourcePath" label="源码路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="chaincodeInfo.sourcePath" placeholder="请输入源码路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="installPath" label="安装路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="chaincodeInfo.installPath" placeholder="请输入安装路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="endorsePolicyPath" label="背书策略路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="chaincodeInfo.endorsePolicyPath" placeholder="请输入背书策略路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="proposalWaitTime" label="提案等待时间(ms)">
                            <el-input-number :disabled="operType == 'INFO'" v-model="chaincodeInfo.proposalWaitTime" :min="120000"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="chaincodeEventListener" label="是否监听链码">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="chaincodeInfo.chaincodeEventListener"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="chaincodeInfo.chaincodeEventListener">
                    <el-col :span="24">
                        <el-form-item prop="callbackLocation" label="回调地址">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="chaincodeInfo.callbackLocation" placeholder="请输入回调地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="events" label="监听事件(,分割)">
                            <el-input :disabled="operType == 'INFO'" v-model="chaincodeInfo.events" placeholder="请输入监听事件"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="install" label="链码是否已安装">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="chaincodeInfo.install"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="instantiate" label="链码是否实例化">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="chaincodeInfo.instantiate"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="upgrade" label="链码是否已升级">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="chaincodeInfo.upgrade"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="remark" label="描述">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="chaincodeInfo.remark" placeholder="请输入描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitChaincodeInfo" size="small">提交</el-button>
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
            langData: [],
            channelData: [],
            chaincodeData: [],
            dialogVisible: false,
            title: '新增Chaincode',
            operType: 'ADD',
            chaincodeRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                // location: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            chaincodeInfo: {
                id: -1,
                name: '',//名称
                version: '',
                language: '',// 加默认值
                businessCode: '',
                channelId: '',
                sourcePath: '',
                installPath: '',
                endorsePolicyPath: '',
                proposalWaitTime: 120000,
                chaincodeEventListener: true,
                callbackLocation: '',
                events: '',
                install: false,
                instantiate: false,
                upgrade: false,
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
        this.getChaincodeList();
    },
    methods: {
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getChaincodeList();
        },
        getChannelList() {
            this.$get(AIGUILLE_FABRIC + '/channel/getMenuList', {}, d => {
                if(d.code == '0000') {
                    this.channelData = d.data;
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        getLangList() {
            this.$get(AIGUILLE_FABRIC + '/sysConfig/getRoleConfig', { typeEnum: 'langType' }, d => {
                if(d.code == '0000') {
                    this.langData = d.data;
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        installChaincode(id) {
            this.$post(AIGUILLE_FABRIC + '/chaincode/installChaincode', { id }, d => {
                if(d.code == '0000') {
                    this.$message({ message: d.message, type: 'success' });
                    this.getChaincodeList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        instantiateChaicode(id) {
            this.$post(AIGUILLE_FABRIC + '/chaincode/instantiateChaicode', { id }, d => {
                if(d.code == '0000') {
                    this.$message({ message: d.message, type: 'success' });
                    this.getChaincodeList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        upgradeChaicode(id) {
            this.$post(AIGUILLE_FABRIC + '/chaincode/upgradeChaicode', { id }, d => {
                if(d.code == '0000') {
                    this.$message({ message: d.message, type: 'success' });
                    this.getChaincodeList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        resetForm() {
            this.chaincodeInfo.id = -1;
            this.chaincodeInfo.name = '';//名称
            this.chaincodeInfo.version = '';
            this.chaincodeInfo.language = '';
            this.chaincodeInfo.businessCode = '';
            this.chaincodeInfo.channelId = '';
            this.chaincodeInfo.sourcePath = '';
            this.chaincodeInfo.installPath = '';
            this.chaincodeInfo.endorsePolicyPath = '';
            this.chaincodeInfo.proposalWaitTime = 120000;
            this.chaincodeInfo.chaincodeEventListener = true;
            this.chaincodeInfo.callbackLocation = '';
            this.chaincodeInfo.events = '';
            this.chaincodeInfo.install = false;
            this.chaincodeInfo.instantiate = false;
            this.chaincodeInfo.upgrade = false;
            this.chaincodeInfo.remark = '';
        },
        getChaincode(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/chaincode/getChaincode', { chaincodeId: id }, d => {
                    if(d.code == '0000') {
                        this.chaincodeInfo.id = d.data.codeId;
                        this.chaincodeInfo.name = d.data.codeName;//名称
                        this.chaincodeInfo.version = d.data.version;
                        this.chaincodeInfo.language = d.data.langCode;
                        this.chaincodeInfo.businessCode = d.data.businessCode;
                        this.chaincodeInfo.channelId = d.data.channelId;
                        this.chaincodeInfo.sourcePath = d.data.sourcePath;
                        this.chaincodeInfo.installPath = d.data.installPath;
                        this.chaincodeInfo.endorsePolicyPath = d.data.endorsePolicyPath;
                        this.chaincodeInfo.proposalWaitTime = d.data.proposalWaitTime;
                        this.chaincodeInfo.chaincodeEventListener = d.data.chaincodeEventListener;
                        this.chaincodeInfo.callbackLocation = d.data.callbackLocation;
                        this.chaincodeInfo.events = d.data.events;
                        this.chaincodeInfo.install = d.data.install || false;
                        this.chaincodeInfo.instantiate = d.data.instantiate || false;
                        this.chaincodeInfo.upgrade = d.data.upgrade || false;
                        this.chaincodeInfo.remark = d.data.remark;
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operChaincodeInfo(id, operType) {
            this.resetForm();
            this.getChaincode(id).then(() => {
                this.openChaincodeDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delChaincodeInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/chaincode/deleteChaincode', { id }, d => {
                    if(d.code == '0000') {
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.$message({ message: d.message, type: 'success' });
                        this.getChaincodeList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitChaincodeInfo() {
            let chaincodeInfo = JSON.parse(JSON.stringify(this.chaincodeInfo));
            let url = 'insertChaincode';
            if(this.operType == 'MOD') {
                url = 'updateChaincode';
            }
            this.$refs.chaincodeForm.validate((valid) => {
                if(valid) {
                    if(typeof chaincodeInfo.proposalWaitTime == 'undefined') {
                        chaincodeInfo.proposalWaitTime = 120000;
                    }
                    this.$post(AIGUILLE_FABRIC + '/chaincode/' + url, chaincodeInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getChaincodeList();
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
        openChaincodeDialog(operType) {
            this.getChannelList();
            this.getLangList();
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改Chaincode';
            }else if(operType == 'ADD') {
                this.title = '新增Chaincode';
                this.resetForm();
            }else{
                this.title = 'Chaincode详情';
            }
            this.dialogVisible = true;
        },
        getChaincodeList() {
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            this.$get(AIGUILLE_FABRIC + '/chaincode/findAllByPage', pageInfo, d => {
                if(d.code == '0000') {
                    this.chaincodeData = d.data.list;
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
div[chaincode_manage] {
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
