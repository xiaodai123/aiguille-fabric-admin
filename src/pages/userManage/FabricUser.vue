<template>
    <div fabric-user>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">FabricUser</span>
                <el-button type="primary" @click="openFabricUserDialog('ADD')" size="mini" round>新增</el-button>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="fabricUserData">
                <!-- <el-table-column width="50" prop="id" align="center" label="ID"></el-table-column> -->
                <el-table-column align="center" type="index" width="50" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="openFabricUserInfo(scope.row.id, 'INFO')">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="roleName" align="center" label="角色"></el-table-column>
                <el-table-column prop="affiliation" align="center" label="从属"></el-table-column>
                <el-table-column prop="orgName" align="center" label="组织"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column width="270" align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="openFabricUserInfo(scope.row.id, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delFabricUserInfo(scope.row.id)" size="mini">删除</el-button>
                            <el-button type="primary" @click="registerUser(scope.row.id)" size="mini">注册</el-button>
                            <el-button type="primary" @click="reenrollUser(scope.row.id)" size="mini">登入</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="total, prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="fabricUserInfo" ref="fabricUserForm" :rules="fabricUserRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="fabricUserInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="role" label="角色">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="fabricUserInfo.role" placeholder="请选择角色">
                                <el-option v-for="(role, index) in roleData" :key="index" :label="role.name" :value="role.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="affiliation" label="从属">
                            <el-input :disabled="operType == 'INFO'" v-model="fabricUserInfo.affiliation" placeholder="请输入从属"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="orgId" label="组织">
                            <el-select :disabled="operType == 'INFO'" clearable v-model="fabricUserInfo.orgId" placeholder="请选择组织">
                                <el-option v-for="(org, index) in orgData" :key="index" :label="org.name" :value="org.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="enrollmentSecret" label="enrollmentSecret">
                            <el-input :disabled="operType == 'INFO'" v-model="fabricUserInfo.enrollmentSecret" placeholder="请输入enrollmentSecret"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="clientCertPath" label="证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="fabricUserInfo.clientCertPath" placeholder="请输入证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="clientKeyPath" label="私钥路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="fabricUserInfo.clientKeyPath" placeholder="请输入私钥路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="register" label="是否已注册">
                            <el-checkbox :disabled="operType == 'INFO'" v-model="fabricUserInfo.register"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitFabricUserInfo" size="small">提交</el-button>
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
            fabricUserData: [],
            dialogVisible: false,
            title: '新增FabricUser',
            operType: 'ADD',
            fabricUserRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                role: [{required: true, message: '请选择角色', trigger: 'blur'}],
                orgId: [{required: true, message: '请选择组织', trigger: 'blur'}]
            },
            fabricUserInfo: {
                id: -1,
                name: '',//名称
                role: '',//角色
                affiliation: '',//从属
                orgId: '',//组织
                enrollmentSecret: '',//enrollmentSecret
                clientCertPath: '',//证书路径
                clientKeyPath: '',//私钥路径
                register: false//是否已注册
            },
            pageInfo: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                total: 0
            },
            roleData: [],
            orgData: []
        }
    },
    mounted() {
        this.getFabricUserList();
    },
    methods: {
        getRoleList() {
            this.$get(AIGUILLE_FABRIC + '/sysConfig/getRoleConfig', { typeEnum: 'userRole' }, d => {
                if(d.code == '0000') {
                    this.roleData = d.data;
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getFabricUserList();
        },
        resetForm() {
            this.fabricUserInfo.id = -1;
            this.fabricUserInfo.role = '';
            this.fabricUserInfo.name = '';
            this.fabricUserInfo.affiliation = '';
            this.fabricUserInfo.orgId = '';//组织
            this.fabricUserInfo.enrollmentSecret = '';//enrollmentSecret
            this.fabricUserInfo.clientCertPath = '';//证书路径
            this.fabricUserInfo.clientKeyPath = '';//私钥路径
            this.fabricUserInfo.register = false;//是否已注册
        },
        getFabricUser(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/user/getFabricUser', { fabricUserId: id }, d => {
                    if(d.code == '0000') {
                        this.fabricUserInfo.id = d.data.id;
                        this.fabricUserInfo.role = d.data.roleCode;
                        this.fabricUserInfo.name = d.data.userName;
                        this.fabricUserInfo.affiliation = d.data.affiliation;
                        this.fabricUserInfo.orgId = d.data.orgId;//组织
                        this.fabricUserInfo.enrollmentSecret = d.data.enrollmentSecret;//enrollmentSecret
                        this.fabricUserInfo.clientCertPath = d.data.clientCertPath;//证书路径
                        this.fabricUserInfo.clientKeyPath = d.data.clientKeyPath;//私钥路径
                        this.fabricUserInfo.register = d.data.register || false;//是否已注册
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        openFabricUserInfo(id, operType) {
            this.resetForm();
            this.getFabricUser(id).then(() => {
                this.openFabricUserDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        registerUser(id) {
            this.$post(AIGUILLE_FABRIC + '/user/registerUser', { fabricUserId: Number(id) }, d => {
                if(d.code == '0000') {
                    this.$message({ message: '注册成功', type: 'success' });
                    this.getFabricUserList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        reenrollUser(id) {
            this.$post(AIGUILLE_FABRIC + '/user/reenrollUser', { fabricUserId: Number(id) }, d => {
                if(d.code == '0000') {
                    this.$message({ message: '登入成功', type: 'success' });
                    this.getFabricUserList();
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        },
        delFabricUserInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/user/deleteUser', { id }, d => {
                    if(d.code == '0000') {
                        this.$message({ message: d.message, type: 'success' });
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.getFabricUserList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitFabricUserInfo() {
            let fabricUserInfo = JSON.parse(JSON.stringify(this.fabricUserInfo));
            let url = 'insertUser';
            if(this.operType == 'MOD') {
                url = 'updateUser';
            }
            this.$refs.fabricUserForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/user/' + url, fabricUserInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getFabricUserList();
                            this.resetForm();
                            this.dialogVisible = false;
                        }else {
                            this.$message({ message: d.message, type: 'error' });
                            // this.$box({title: '提示', message: d.message, type: 'fail'});
                        }
                    })
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
        openFabricUserDialog(operType) {
            this.getOrgList();
            this.getRoleList();
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改FabricUser';
            }else if(operType == 'ADD') {
                this.title = '新增FabricUser';
                this.resetForm();
            }else{
                this.title = 'FabricUser详情';
            }
            this.dialogVisible = true;
        },
        getFabricUserList() {
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            this.$get(AIGUILLE_FABRIC + '/user/findAllByPage', pageInfo, d => {
                if(d.code == '0000') {
                    this.fabricUserData = d.data.list;
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
div[fabric-user] {
    .el-select {
        width: 100%;
    }
}
</style>

