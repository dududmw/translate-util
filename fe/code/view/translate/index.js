/**
 * Created by yaoyi on 2017/8/1.
 */
import React, {Component} from 'react';
import s from './index.less';
import http from 'wrapper/http';

export default class Translate extends Component {
    constructor(props){
        super(props);
        this.state={
            status:'idle',
            content:''
        };
    }
    translate(from,to,text){
        const {status}=this.state;
        if(status!='idle')return;
        this.setState({status:'pending'});
        const {type}=this.props;
        let url=`${window.location.protocol}//${window.location.hostname}:9000/translate`;
        http
            .post(url,JSON.stringify({
                from,
                to,
                type,
                q:[{id:1,text:text}]
            }))
            .then(result=>{
                if(result.status==200&&result.data.errorCode==0&&result.data.data.length>0){
                    return result.data.data[0].text;
                }
                else{
                    throw Error();
                }
            })
            .catch(e=>{
                return '<span style="color:red;">翻译失败</span>'
            })
            .then(text=>{
                this.setState({
                    status:'idle',
                    content:text
                });
            })
    }
    render() {
        const {content,status}=this.state;
        let html=content;
        if(status=='pending'){
            html='<span style="color:#999">翻译中...</span>';
        }

        return (
            <div className={s.root} dangerouslySetInnerHTML={{__html:html}}></div>
        );
    }
}