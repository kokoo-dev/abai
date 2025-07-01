package com.kokoo.abai.common.extension

import jakarta.servlet.http.HttpServletRequest

fun HttpServletRequest.getClientIp(): String {
    val ip = this.getHeader("X-Forwarded-For")
    return if (ip.isNullOrEmpty() || ip.equals("unknown", ignoreCase = true)) {
        this.remoteAddr
    } else {
        ip.split(",")[0].trim()
    }
}