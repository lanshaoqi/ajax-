using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CSCM.DataTableAjax
{
	/// <summary>
	/// 请求的类型   删除还是读取数据
	/// </summary>
	public enum PostType{
		Delete,
		GetData,
        Refresh
	}
	/// <summary>
	/// 列的显示属性
	/// </summary>
	public enum ColumnShowType { 
		Show,
		Hide
	}
	/// <summary>
	/// 表格是样式
	/// </summary>
	public enum DataTableStyle {
		Null,
		Default
	}
	/// <summary>
	/// 分页的方式   内存分页   数据库分页
	/// </summary>
	public enum PageDataTableType
	{
		MesPage,
		DBPage
	}
    /// <summary>
    /// 是否进行缓存
    /// </summary>
    public enum PageDataTableCache
    {
        Yes,
        No
    }
	/// <summary>
	/// 删除是否成功
	/// </summary>
	public enum DeleteItemState { 
		Yes,
	    No
	}
    /// <summary>
    /// 读取数据是否成功
    /// </summary>
    public enum GetDataState {
        Yes,
        No
    }
	[Serializable]
	public class PostForm
	{
		/// <summary>
		/// 当前页的索引
		/// </summary>
		public int PageIndex { get; set; }
		/// <summary>
		/// 条件查询的条件
		/// </summary>
		public string WhereTxt { get; set; }
		/// <summary>
		/// 删除、修改函数的定义条件参数
		/// </summary>
		public string WhereKey { get; set; }
		/// <summary>
		/// 请求是删除还是读取数据【0删除】【1读取数据】【2刷新当前数据】
		/// </summary>
		public PostType PostTypeFun { get; set; }
	}
}
