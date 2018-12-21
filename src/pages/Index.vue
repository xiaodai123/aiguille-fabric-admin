<template>
    <div data-index-box>
        <div style="display: flex;">
            <div id="categoryMain" style="width: 50%;height:300px;"></div>
            <div id="verticalMain" style="width: 50%;height:300px;"></div>
        </div>
        <section>
            <span style="display: flex;align-items: center;" class="cm_line">
                <span style="flex: 1;">联盟信息</span>
            </span>
            <hr class="cm_dotted">
        </section>
        <section>
            <el-table size="mini" :header-cell-style="{'background-color':'#F4F5F9','height':'40px'}" border :data="leagueInfos">
                <el-table-column prop="leagueName" align="center" label="名称"></el-table-column>
                <el-table-column prop="remark" align="center" label="描述"></el-table-column>
                <el-table-column prop="createdatetime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updatedatetime" align="center" label="更新时间"></el-table-column>
            </el-table>
        </section>
    </div>
</template>
<script>
import { AIGUILLE_FABRIC } from '~compJs/const';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
export default {
    data(){
        return {
            echartsData: {
                label: {
                    leagueNum: '联盟',
                    orgNum: '组织',
                    ordererNum: '排序',
                    peerNum: '节点',
                    caNum: 'CA',
                    channelNum: '通道',
                    chaincodeNum: '链码'
                },
                value: {
                    leagueNum: 0,
                    orgNum: 0,
                    ordererNum: 0,
                    peerNum: 0,
                    caNum: 0,
                    channelNum: 0,
                    chaincodeNum: 0
                },
                datas: [
                    {
                        value: '',
                        name: '联盟',
                        id: 'leagueNum'
                    },
                    {
                        value: '',
                        name: '组织',
                        id: 'orgNum'
                    },
                    {
                        value: '',
                        name: '排序',
                        id: 'ordererNum'
                    },
                    {
                        value: '',
                        name: '节点',
                        id: 'peerNum'
                    },
                    {
                        value: '',
                        name: 'CA',
                        id: 'caNum'
                    },
                    {
                        value: '',
                        name: '通道',
                        id: 'channelNum'
                    },
                    {
                        value: '',
                        name: '链码',
                        id: 'chaincodeNum'
                    }
                ]
            },
            leagueInfos: []
        }
    },
    mounted() {
        this.getLeagueInfo();
        this.getMenuCount().then(() => {
            let echartsData = this.echartsData;
            this.setVerticalMainn(echartsData);
            this.setCategoryMain(echartsData);
        }).catch(res => {
            console.log(res)
        })
    },
    methods: {
        setVerticalMainn(echartsData) {
            var verticalMain = echarts.init(document.getElementById('verticalMain'));
            let verticalMainOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: Object.values(echartsData.label)
                },
                series: [
                    {
                        name:'模块信息统计',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: echartsData.datas
                    }
                ]
            };
            verticalMain.setOption(verticalMainOption);
        },
        setCategoryMain(echartsData) {
            var categoryMain = echarts.init(document.getElementById('categoryMain'));
            let categoryMainOption = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : Object.values(echartsData.label),
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'模块信息统计',
                        type:'bar',
                        barWidth: '60%',
                        data: Object.values(echartsData.value)
                    }
                ]
            };
            categoryMain.setOption(categoryMainOption);
        },
        getMenuCount() {
            return new Promise((reslove, reject) => {
                this.$get(AIGUILLE_FABRIC + '/index/getMenuCount', {}, d => {
                    if(d.code == '0000') {
                        let label = [];
                        let keys = Object.keys(d.data);
                        let datas = this.echartsData.datas;
                        keys.forEach(key => {
                            this.echartsData.value[key] = d.data[key];
                            for(let i = 0; i < datas.length; i++) {
                                if(datas[i].id == key) {
                                    datas[i].value = d.data[key];
                                    break;
                                }
                            }
                        })
                        reslove();
                    }else {
                        this.$message({ message: d.message, type: 'error' });
                        reject();
                    }
                })
            })
        },
        getLeagueInfo() {
            this.$get(AIGUILLE_FABRIC + '/index/getLeagueInfo', {}, d => {
                if(d.code == '0000') {
                    this.leagueInfos = d.data;
                }else {
                    this.$message({ message: d.message, type: 'error' });
                }
            })
        }
    },
    computed: {
        // ...mapGetters({
        //     token2: 'auth/token1'
        // })
    }
}
</script>
<style lang="scss">
div[data-index-box] {
    .div3 {
        width: 100px;
        height: 100px;
        background-color: aqua;
    }
}
</style>


