import React,{Component} from 'react';
import _ from 'lodash';
import {Row,Col,AutoComplete,Input,Button,Modal,Table,message,Select,InputNumber} from 'antd';
import s from './index.less';

export default class Edit extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        };
        this.setData(props);
        this._columns=[
            {title:'属性名',render:(data,record,index)=>{
                return (
                    <Input
                        style={{width:'100%'}}
                        value={record.attr}
                        onChange={(e)=>{
                            record.attr=e.target.value;
                            this.forceUpdate();
                        }}
                    />
                );
            }},
            {title:'正则表达式',render:(data,record,index)=>{
                return (
                    <Input
                        style={{width:'100%'}}
                        value={record.reg}
                        onChange={(e)=>{
                            record.reg=e.target.value;
                            this.forceUpdate();
                        }}
                    />
                );
            }},
            {title:'操作',render:(data,record,index)=>{
                return (
                    <Button
                        type="primary"
                        size="large"
                        onClick={()=>{
                            this.state.data.splice(index,1);
                            this.forceUpdate();
                        }}>删除</Button>
                );
            }},
        ];
        this.key=0;
    }
    setData(props){
        this.state.data=_.cloneDeep(props.form);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.form!==nextProps.form){
            this.setData(nextProps);
        }
    }
    submit(){
        const {onSubmit,onCancel}=this.props;
        onSubmit(this.state.data.slice());
        onCancel();
    }
    render(){
        const {open,onCancel}=this.props;
        const {data}=this.state;
        return (
            <Modal title="编辑校验规则"
                   visible={open}
                   onOk={this.submit.bind(this)}
                   onCancel={onCancel}
                   width="610px"
            >
                <div className={s.row}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={()=>{
                        this.state.data.push({key:this.key,attr:'',reg:''});
                        this.key+=1;
                        this.forceUpdate();
                    }}>新增</Button>
                </div>
                <Table
                    columns={this._columns}
                    dataSource={data}
                    bordered
                    pagination={false}
                ></Table>
            </Modal>
        );
    }
}