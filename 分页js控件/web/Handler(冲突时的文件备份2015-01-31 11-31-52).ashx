<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;

public class Handler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
		GetData(context);
    }
	public void GetData(HttpContext context)
	{
        CSCM.DataTableAjax.DataTableManager dm = new CSCM.DataTableAjax.DataTableManager(context,"lanshaoqi");
        dm.ShowTableStyle = CSCM.DataTableAjax.DataTableStyle.Default;
        dm.DeleteItem += new CSCM.DataTableAjax._DeleteItem(dm_DeleteItem);
		//dm.
        dm.GetDataTableMes += new CSCM.DataTableAjax._GetDataTableMes(dm_GetDataTableMes);
        dm.Init();
	}

    void dm_GetDataTableMes(ref CSCM.DataTableAjax.PostForm Pf, out DataTable Dt, out Dictionary<string, CSCM.DataTableAjax.UserEval> DisKey, out string WhereKey, ref int PageSize, ref CSCM.DataTableAjax.GetDataState GetDataState, ref string StateMagTxt)
    {
        WhereKey = "BID";
        try
        {
            SqlConnection sqlcon = new SqlConnection("server=127.0.0.1\\SQLEXPRESS;database=MyTest;uid=sa;pwd=sasa;");
            sqlcon.Open();
            string sql = "select * from BookInfo";
            SqlDataAdapter sqla = new SqlDataAdapter(sql, sqlcon);
            DataSet ds = new DataSet();
            sqla.Fill(ds);
            sqlcon.Close();
            DataTable dt = ds.Tables[0];
            Dt = dt;
            Dictionary<string, CSCM.DataTableAjax.UserEval> dddd = new Dictionary<string, CSCM.DataTableAjax.UserEval>();
            dddd.Add("时间", new CSCM.DataTableAjax.UserEval("CrTime"));
            dddd.Add("价格", new CSCM.DataTableAjax.UserEval("BPicCount"));
            dddd.Add("名称", new CSCM.DataTableAjax.UserEval("BookName"));
            dddd.Add("编号", new CSCM.DataTableAjax.UserEval("BID"));
            DisKey = dddd;
            Dt = dt;
        }
        catch (Exception)
        {
            DisKey = null;
            Dt = null;
        }
    }

    void dm_DeleteItem(ref CSCM.DataTableAjax.PostForm Pf, out CSCM.DataTableAjax.DeleteItemState state, ref string Mag)
	{

        string key = Pf.WhereKey;
        SqlConnection sqlcon = new SqlConnection("server=127.0.0.1\\SQLEXPRESS;database=MyTest;uid=sa;pwd=sasa;");
        sqlcon.Open();
        string sql = "delete from BookInfo where BID=" + key;
        SqlCommand sm = new SqlCommand(sql, sqlcon);
        int a = sm.ExecuteNonQuery();
        sqlcon.Close();
        if (a > 0)
        {
            state =CSCM.DataTableAjax.DeleteItemState.Yes;
        }
        else
        {
            state = CSCM.DataTableAjax.DeleteItemState.No;
        }
        //state = CSCM.DataTableAjax.DeleteItemState.No;
	}

    public bool IsReusable {
        get {
            return false;
        }
    }

}