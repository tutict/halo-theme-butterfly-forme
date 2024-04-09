export class HaloApi {
  /**
   * 实现点赞功能
   *
   * @description: Like function
   * @param {string} group
   * @param {string} plural
   * @param {string} name
   */
  static async like(group, plural, name) {
    const response = await fetch("/apis/api.halo.run/v1alpha1/trackers/upvote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group: group,
        plural: plural,
        name: name,
      }),
    });
    if (response.status !== 200) {
      console.error("点赞失败，请求异常");
      return;
    }
    return response;
  }
}
