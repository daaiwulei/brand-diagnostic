// netlify/functions/submit.js
exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // 1. 获取飞书 Token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: 'cli_aaa7dc4f98389cd2',
        app_secret: 'drntJvR2rLtBymQmuHtAmbMI1fJuJiZn',
      }),
    });
    
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      throw new Error(`获取Token失败: ${tokenData.msg}`);
    }
    
    const token = tokenData.tenant_access_token;

    // 2. 写入飞书多维表格
    const feishuRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/UTmGwC51Fisv75kH9jacX5HXnMd/tables/tblaphf5nGQlEMTy/records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fields: data.fields }),
      }
    );
    
    const feishuData = await feishuRes.json();
    
    if (feishuData.code !== 0) {
      throw new Error(`写入飞书失败: ${feishuData.msg}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true, data: feishuData.data }),
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};