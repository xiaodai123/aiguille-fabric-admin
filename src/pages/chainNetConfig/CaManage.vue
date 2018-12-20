<template>
    <div ca_manage>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">Ca管理</span>
                <el-button type="primary" @click="openCaDialog('ADD')" size="mini" round>新增</el-button>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="caData">
                <el-table-column prop="id" align="center" label="ID"></el-table-column>
                <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span style="text-decoration-line: underline;cursor: pointer;" @click="operCaInfo(scope.row.id, 'INFO')">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" align="center" label="访问地址"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div style="display: flex;justify-content: center;">
                            <el-button type="primary" @click="operCaInfo(scope.row.id, 'MOD')" size="mini">修改</el-button>
                            <el-button type="primary" @click="delCaInfo(scope.row.id)" size="mini">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="pageInfo.total != 0" style="text-align: right;margin-top: 30px;">
                <el-pagination mini layout="total, prev, pager, next" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" @current-change="currentChange"></el-pagination>
            </div>
        </section>
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" :title="title">
            <el-form style="width: 80%;margin-left: 10%;" v-if="dialogVisible" size="small" label-position="right" label-width="120px" :model="caInfo" ref="caInfoForm" :rules="caInfoRule">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="name" label="名称">
                            <el-input :disabled="operType == 'INFO'" v-model="caInfo.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="location" label="访问地址">
                            <el-input :disabled="operType == 'INFO'" v-model="caInfo.location" placeholder="请输入访问地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="serverCrtPath" label="服务端证书路径">
                            <el-input :rows="5" type="textarea" :disabled="operType == 'INFO'" v-model="caInfo.serverCrtPath" placeholder="请输入服务端证书路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span v-if="operType != 'INFO'" slot="footer">
                <el-button type="primary" @click="submitCaInfo" size="small">提交</el-button>
                <el-button type="primary" @click="dialogVisible = false" size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { MessageBox } from 'element-ui';
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
            caData: [],
            dialogVisible: false,
            title: '新增CA',
            operType: 'ADD',
            caInfoRule: {
                name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                location: [{required: true, message: '请输入访问地址', trigger: 'blur'}]
            },
            caInfo: {
                id: -1,
                location: '',//访问地址
	            name: '',//名称
 	            serverCrtPath: ''//服务端证书路径
            },
            pageInfo: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                total: 0
            }
        }
    },
    mounted() {
        this.getCaList();
    },
    methods: {
        currentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getCaList();
        },
        resetForm() {
            this.caInfo.id = -1;
            this.caInfo.location = '';//访问地址
            this.caInfo.name = '';//名称
            this.caInfo.serverCrtPath = '';//服务端证书路径
        },
        getCa(id) {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/ca/getCa', { caId: id }, d => {
                    if(d.code == '0000') {
                        this.caInfo.id = d.data.id;
                        this.caInfo.location = d.data.location;//访问地址
                        this.caInfo.name = d.data.name;//名称
                        this.caInfo.serverCrtPath = d.data.serverCrtPath;//服务端证书路径
                        reslove();
                    }else {
                        reject();
                    }
                })
            })
        },
        operCaInfo(id, operType) {
            this.resetForm();
            this.getCa(id).then(() => {
                this.openCaDialog(operType);
            }).catch(res => {
                console.log(res)
            })
        },
        delCaInfo(id) {
            MessageBox.confirm("是否删除", "温馨提示", {
                confirmButtonText: '确定',
                cancelButtonText: "取消",
                type: 'fail'
            }).then(() => {
                this.$post(AIGUILLE_FABRIC + '/ca/deleteCa', { id }, d => {
                    if(d.code == '0000') {
                        this.$message({ message: d.message, type: 'success' });
                        // this.$box({title: '提示', message: d.message, type: 'success'});
                        this.getCaList();
                    }else {
                        // this.$box({title: '提示', message: d.message, type: 'fail'});
                        this.$message({ message: d.message, type: 'error' });
                    }
                })
            });
        },
        submitCaInfo() {
            let caInfo = JSON.parse(JSON.stringify(this.caInfo));
            let url = 'insertCa';
            if(this.operType == 'MOD') {
                url = 'updateCa';
            }
            this.$refs.caInfoForm.validate((valid) => {
                if(valid) {
                    this.$post(AIGUILLE_FABRIC + '/ca/' + url, caInfo, d => {
                        if(d.code == '0000') {
                            // this.$box({title: '提示', message: d.message, type: 'success'});
                            this.$message({ message: d.message, type: 'success' });
                            this.getCaList();
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
        openCaDialog(operType) {
            this.operType = operType;
            if(operType == 'MOD') {
                this.title = '修改CA';
            }else if(operType == 'ADD') {
                this.title = '新增CA';
                this.resetForm();
            }else{
                this.title = 'CA详情';
            }
            this.dialogVisible = true;
        },
        getCaList() {
            let pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            this.$get(AIGUILLE_FABRIC + '/ca/findAllByPage', pageInfo, d => {
                if(d.code == '0000') {
                    this.caData = d.data.list;
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
