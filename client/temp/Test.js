import React, { Component } from 'react';
import { Row, Col, Card, Statistic, Button, Radio, Icon, Modal, Input } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../../constants';
import UserProfile from '../../UserProfile';
import '../../css/Layout.css';
import DashboardLayout from '../../layouts/DashboardLayout';
import Stage from './interact_index';
import MultipleTargets from './MultipleTargets';

const uuidv1 = require('uuid/v1');

function Test() {
	return (
		<DashboardLayout><MultipleTargets /></DashboardLayout>
	)
}

export default Test;