// Simple in-memory database (replace with a real database in production)
class Database {
  constructor() {
    this.users = new Map(); // userId -> userData
    this.stats = {
      totalViews: 0,
      totalComments: 0,
      totalLikes: 0
    };
  }

  // User management
  getUser(userId) {
    return this.users.get(userId);
  }

  createUser(userId, username) {
    const userData = {
      userId,
      username,
      uploadLinks: [],
      accountVerified: false,
      verificationCode: null,
      accountInfo: null,
      paymentMethods: [],
      paymentDetails: []
    };
    this.users.set(userId, userData);
    return userData;
  }

  updateUser(userId, data) {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, data);
      return user;
    }
    return null;
  }

  // Upload links
  addUploadLink(userId, link) {
    const user = this.getUser(userId);
    if (user) {
      user.uploadLinks.push({
        link,
        addedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  }

  getUploadLinks(userId) {
    const user = this.getUser(userId);
    return user ? user.uploadLinks : [];
  }

  // Account verification
  generateVerificationCode(userId) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const user = this.getUser(userId);
    if (user) {
      user.verificationCode = code;
      return code;
    }
    return null;
  }

  verifyAccount(userId, code) {
    const user = this.getUser(userId);
    if (user && user.verificationCode === code) {
      user.accountVerified = true;
      user.verificationCode = null;
      return true;
    }
    return false;
  }

  // Account info
  setAccountInfo(userId, platform, username) {
    const user = this.getUser(userId);
    if (user) {
      user.accountInfo = { platform, username };
      return true;
    }
    return false;
  }

  // Payment methods
  addPaymentMethod(userId, method) {
    const user = this.getUser(userId);
    if (user) {
      user.paymentMethods.push({
        method,
        email: method === 'paypal' ? null : undefined,
        addedAt: new Date().toISOString()
      });
      return user.paymentMethods.length - 1;
    }
    return -1;
  }

  setPaypalEmail(userId, methodIndex, email) {
    const user = this.getUser(userId);
    if (user && user.paymentMethods[methodIndex]) {
      user.paymentMethods[methodIndex].email = email;
      user.paymentMethods[methodIndex].name = email;
      return true;
    }
    return false;
  }

  removePaymentMethod(userId, methodIndex) {
    const user = this.getUser(userId);
    if (user && user.paymentMethods[methodIndex]) {
      user.paymentMethods.splice(methodIndex, 1);
      return true;
    }
    return false;
  }

  // Payment details
  addPaymentDetail(userId, walletAddress) {
    const user = this.getUser(userId);
    if (user) {
      user.paymentDetails.push({
        walletAddress,
        addedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  }

  removePaymentDetail(userId, detailIndex) {
    const user = this.getUser(userId);
    if (user && user.paymentDetails[detailIndex]) {
      user.paymentDetails.splice(detailIndex, 1);
      return true;
    }
    return false;
  }

  // Stats
  getStats() {
    return this.stats;
  }

  updateStats(views, comments, likes) {
    this.stats.totalViews += views || 0;
    this.stats.totalComments += comments || 0;
    this.stats.totalLikes += likes || 0;
  }

  getUserStats(userId) {
    const user = this.getUser(userId);
    if (user) {
      return {
        uploadedVideos: user.uploadLinks.length,
        accountVerified: user.accountVerified,
        paymentMethodsCount: user.paymentMethods.length
      };
    }
    return null;
  }
}

module.exports = new Database();
