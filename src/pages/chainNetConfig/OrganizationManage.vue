<template>
    <div organization_manage>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">Organization管理</span>
                <el-button type="primary" @click="openOrgDialog('ADD')" size="mini" round>新增</el-button>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="orgData">
                <el-table-column prop="orgId" align="center" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operOrgInfo(scope.row.orgId, 'INFO')">{{scope.row.orgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mspId" align="center" label="MspId"></el-table-column>
                <el-table-column width="300" prop="remark" align="center" label="描述"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operOrgInfo(scope.row.orgId, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delOrgInfo(scope.row.orgId)" size="mini">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="orgInfo" ref="orgInfoForm" :rules="orgInfoRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="orgInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="mspId" label="MspID">
                            <el-input :disabled="operType == 'INFO'" v-model="orgInfo.mspId" placeholder="请输入MspID"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="domainName" label="域名">
                            <el-input :disabled="operType == 'INFO'" v-model="orgInfo.domainName" placeholder="请输入域名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="caId" label="CA服务器">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="orgInfo.caId" placeholder="请选择CA服务器">
                                <el-option v-for="(ca, index) in caData" :key="index" :label="ca.name" :value="ca.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="tls" label="是否启用TLS">
                            <el-checkbox :disabled="operType == 'INFO'" true-label="1" false-label="0" v-model="orgInfo.tls"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="remark" label="描述">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="orgInfo.remark" placeholder="请输入描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitOrgInfo" size="small">提交</el-button>
                <el-button type="primary" @click="dialogVisible = false" size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { MessageBox } from 'element-ui';
import { AIGUILLE_FABRIC } from '~compJs/const';
// import { Button, Table, TableColumn, Dialog, Form, FormItem, Input } from 'element-ui';
// Vue.use(Button);
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(Dialog);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Input);
export default {
    data() {
        return {
            caData: [],
            orgData: [],
            dialogVisible: false,
            title: '新增Organization',
            operType: 'ADD',
            orgInfoRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                // mspId: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            orgInfo: {
                id: -1,
                name: '',//名称 
                mspId: '',
                caId: '',
                tls: '1',
 	            remark: ''
            }
        }
    },
    mounted() {
        this.getOrgList();
    },
    methods: {
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
            this.orgInfo.id = -1;
            this.orgInfo.mspId = '';
            this.orgInfo.name = '';//名称
            this.orgInfo.caId = '';
            this.orgInfo.tls = '1';
            this.orgInfo.remark = '';
        },
        getOrg(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/org/getOrg', { orgId: id }, d => {
                    if(d.code == '0000') {
                        this.orgInfo.id = d.data.orgId;
                        this.orgInfo.mspId = d.data.mspId;//访问地址
                        this.orgInfo.name = d.data.orgName;//名称
                        this.orgInfo.caId = d.data.caId;
                        this.orgInfo.domainName = d.data.domainName;
                        this.orgInfo.tls = d.data.tls;
                        this.orgInfo.remark = d.data.remark;
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operOrgInfo(id, operType) {
            this.resetForm();
            this.getOrg(id).then(() => {
                this.openOrgDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delOrgInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/org/deleteOrg', { id }, d => {
                    if(d.code == '0000') {
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.$message({ message: d.message, type: 'success' });
                        this.getOrgList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitOrgInfo() {
            let orgInfo = JSON.parse(JSON.stringify(this.orgInfo));
            let url = 'insertOrg';
            if(this.operType == 'MOD') {
                url = 'updateOrg';
            }
            this.$refs.orgInfoForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/org/' + url, orgInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getOrgList();
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
        openOrgDialog(operType) {
            this.getCaList()
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改Organization';
            }else if(operType == 'ADD') {
                this.title = '新增Organization';
                this.resetForm();
            }else{
                this.title = 'Organization详情';
            }
            this.dialogVisible = true;
        },
        getOrgList() {
            this.$get(AIGUILLE_FABRIC + '/org/getOrgList', {}, d => {
                if(d.code == '0000') {
                    this.orgData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        }
    }
}
</script>
