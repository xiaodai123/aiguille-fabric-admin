<template>
    <div platform-user>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">PlatformUser</span>
                <el-button v-if="roleCode == 1" type="primary" @click="openPlatformUserDialog('ADD')" size="mini" round>新增</el-button>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="platformUserData">
                <el-table-column prop="id" align="center" label="ID"></el-table-column>
                <el-table-column prop="username" align="center" label="名称"></el-table-column>
                <el-table-column prop="roleName" align="center" label="角色"></el-table-column>
                <el-table-column prop="createDate" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updateDate" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div v-if="roleCode == 1" style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="openPlatformUserInfo(scope.row.id, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delPlatformUserInfo(scope.row.id)" size="mini">删除</el-button>
                        </div>
                        <div v-else>无</div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="total, prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="platformUserInfo" ref="platformUserForm" :rules="platformUserRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="username" label="名称">
                            <el-input v-model="platformUserInfo.username" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="role" label="角色">
                            <el-select clearable v-model="platformUserInfo.role" placeholder="请选择角色">
                                <el-option v-for="(role, index) in roleData" :key="index" :label="role.name" :value="role.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="operType == 'ADD'">
                    <el-col :span="24">
                        <el-form-item prop="password" label="密码">
                            <el-input v-model="platformUserInfo.password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="submitPlatformUserInfo" size="small">提交</el-button>
                <el-button type="primary" @click="dialogVisible = false" size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { MessageBox } from 'element-ui';
import { Session } from '~compJs/public';
import { AIGUILLE_FABRIC, PAGE_SIZE } from '~compJs/const';
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
            platformUserData: [],
            dialogVisible: false,
            title: '新增PlatformUser',
            operType: 'ADD',
            platformUserRule: {
                username: [{required: true, message: '请输入名称', trigger: 'blur'}],
                role: [{required: true, message: '请选择角色', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            platformUserInfo: {
                id: -1,
                username: '',//名称
                role: '',//角色
                password: ''
            },
            pageInfo: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                total: 0
            },
            roleData: [],
            userInfo: '',
            userId: '',
            roleCode: ''
        }
    },
    mounted() {
        this.getPlatformUserList();
        this.userInfo = JSON.parse(Session.get('UINFO'));
        this.userId = this.userInfo.id;
        this.roleCode = this.userInfo.roleCode;
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
            this.getPlatformUserList();
        },
        resetForm() {
            this.platformUserInfo.id = -1;
            this.platformUserInfo.username = '';//名称
            this.platformUserInfo.role = '';//角色
            this.platformUserInfo.password = '';
        },
        getPlatformUser(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/platformUser/getUser', { platformUserId: id }, d => {
                    if(d.code == '0000') {
                        this.platformUserInfo.id = d.data.id;
                        this.platformUserInfo.username = d.data.username;//名称
                        this.platformUserInfo.role = d.data.roleCode;//角色
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        openPlatformUserInfo(id, operType) {
            this.resetForm();
            this.getPlatformUser(id).then(() => {
                this.openPlatformUserDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delPlatformUserInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/platformUser/deleteUser', { userId: id }, d => {
                    if(d.code == '0000') {
                        this.$message({ message: d.message, type: 'success' });
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        logout() {
            this.$get(AIGUILLE_FABRIC + '/login/userLogout', {}, data => {
                if (data.code === '0000') {
                    this.$store.dispatch('auth/setGeti', false);
                    Session.remove('UINFO');
                    window.location.href = 'login.html';
                }
            })
        },
        submitPlatformUserInfo() {
            let platformUserInfo = JSON.parse(JSON.stringify(this.platformUserInfo));
            let url = 'insertUser';
            if(this.operType == 'MOD') {
                url = 'updateUser';
            }
            this.$refs.platformUserForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/platformUser/' + url, platformUserInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            let roleCode = this.userInfo.roleCode;
                            let userIdd = this.userInfo.id;
                            this.getPlatformUserList();
                            if(this.operType == 'MOD') {
                                if(roleCode == 1 && userIdd != id) {
                                    this.$message({ message: d.message, type: 'success' });
                                    this.getPlatformUserList();
                                    this.resetForm();
                                    this.dialogVisible = false;
                                }else {
                                    this.$message({ message: d.message + '，请重新登录！！！', type: 'success' });
                                    this.logout();
                                }
                            }else {
                                this.getPlatformUserList();
                                this.resetForm();
                                this.dialogVisible = false;
                            }
                        }else {
                            this.$message({ message: d.message, type: 'error' });
                            // this.$box({title: '提示', message: d.message, type: 'fail'});
                        }
                    })
                }
            })
        },
        openPlatformUserDialog(operType) {
            this.getRoleList();
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改PlatformUser';
            }else if(operType == 'ADD') {
                this.title = '新增PlatformUser';
                this.resetForm();
            }else{
                this.title = 'PlatformUser详情';
            }
            this.dialogVisible = true;
        },
        getPlatformUserList() {
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            this.$get(AIGUILLE_FABRIC + '/platformUser/findAllByPage', pageInfo, d => {
                if(d.code == '0000') {
                    let roleCode = this.userInfo.roleCode;
                    if(roleCode == 1) {
                        this.platformUserData = d.data.list;
                        this.pageInfo.total = d.data.total;
                    }else {
                        this.platformUserData = d.data;
                    }
                    
                }else {
                    // this.$box({title: '提示', message: '查询失败', moreMessage: d.message, type: 'fail'});
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        }
    }
}
</script>
<style lang="sass">
div[platform-user] {
    .el-select {
        width: 100%;
    }
}
</style>

