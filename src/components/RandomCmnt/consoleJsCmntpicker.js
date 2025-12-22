(function () {
  const STORAGE_KEY = "ig_unique_comment_users_with_avatar";

  // آرایه قبلی
  const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // برای جلوگیری از تکرار سریع
  const storedMap = new Map(storedUsers.map((user) => [user.username, user]));

  // استخراج کاربران از پست فعلی
  document.querySelectorAll('a[href^="/"][role="link"]').forEach((link) => {
    const href = link.getAttribute("href");

    // فقط پروفایل‌ها
    if (!/^\/[^/]+\/$/.test(href)) return;

    const username = href.replace(/\//g, "");

    if (storedMap.has(username)) return;

    // پیدا کردن عکس پروفایل
    const img =
      link.querySelector("img") || link.closest("li")?.querySelector("img");

    const profileImage = img?.src || null;

    storedMap.set(username, {
      username,
      profileImage,
    });
  });

  // آرایه نهایی
  const finalArray = Array.from(storedMap.values());

  // ذخیره
  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalArray));

  // خروجی
  console.clear();
  console.log("📦 آرایه نهایی کاربران:");
  console.table(finalArray);
  console.log(`✅ تعداد کل کاربران یکتا: ${finalArray.length}`);
})();
