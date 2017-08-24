const common = require('./common');

const REMOVE_IPV4_MAPPED_IPV6_RE = /^::ffff:/;

// TODO: Build parseScrapeRequest and parseAnnounceRequest
exports.parseScrapeRequest = (req) => {
  const qs = req.url.split('?');
  const params = common.querystringParse(qs[1]);
  params.action = common.ACTIONS.SCRAPE;

  if (typeof params.info_hash === 'string') {
    params.info_hash = [params.info_hash];
  }

  if (Array.isArray(params.info_hash)) {
    params.info_hash = params.info_hash.map((binaryInfoHash) => {
      if (typeof binaryInfoHash !== 'string' || binaryInfoHash.length !== 20) {
        throw new Error('invalid info_hash');
      }
      return common.binaryToHex(binaryInfoHash);
    });
  }
};

exports.parseAnnounceRequest = (req, options) => {
  const qs = req.url.split('?');
  const params = common.querystringParse(qs[1]);
  params.action = common.ACTIONS.ANNOUNCE;

  // Check for malformed info_hash
  if (typeof params.info_hash !== 'string' || params.info_hash.length !== 20) {
    throw new Error('invalid info_hash');
  }

  params.info_hash = common.binaryToHex(params.info_hash);

  // Check for malformed peer_id
  if (typeof params.peer_id !== 'string' || params.peer_id.length !== 20) {
    throw new Error('invalid peer_id');
  }

  params.peer_id = common.binaryToHex(params.peer_id);

  params.port = Number(params.port);
  if (!params.port) {
    throw new Error('invalid port');
  }

  params.left = Number(params.left);
  params.compact = Number(params.compact);
  params.numwant = Math.min(
    Number(params.numwant) || common.NUM_ANNOUNCE_PEERS,
    common.MAX_ANNOUNCE_PEERS,
  );

  params.ip = options.trustProxy
    ? req.headers['x-forwarded-for'] || req.connection.remoteAddress
    : req.connection.remoteAddress.replace(REMOVE_IPV4_MAPPED_IPV6_RE, ''); // force ipv4
  params.addr = `${common.IPV6_RE.test(params.ip) ? `[${params.ip}]` : params.ip}:${params.port}`;
};

// TODO: parseHttpRequest use in timberwolf is deprecated
exports.parseHttpRequest = (req, options) => {
  const parsedOptions = options || {};
  const s = req.url.split('?');
  const params = common.querystringParse(s[1]);


  if (parsedOptions.action === 'announce' || s[0] === '/announce') {
    params.action = common.ACTIONS.ANNOUNCE;

    if (typeof params.info_hash !== 'string' || params.info_hash.length !== 20) { throw new Error('invalid info_hash'); }
    params.info_hash = common.binaryToHex(params.info_hash);
    if (typeof params.peer_id !== 'string' || params.peer_id.length !== 20) { throw new Error('invalid peer_id'); }
    params.peer_id = common.binaryToHex(params.peer_id);

    params.port = Number(params.port);
    if (!params.port) throw new Error('invalid port');

    params.left = Number(params.left);
    params.compact = Number(params.compact);
    params.numwant = Math.min(
      Number(params.numwant) || common.NUM_ANNOUNCE_PEERS,
      common.MAX_ANNOUNCE_PEERS,
    );

    params.ip = parsedOptions.trustProxy
      ? req.headers['x-forwarded-for'] || req.connection.remoteAddress
      : req.connection.remoteAddress.replace(REMOVE_IPV4_MAPPED_IPV6_RE, ''); // force ipv4
    params.addr = `${common.IPV6_RE.test(params.ip) ? `[${params.ip}]` : params.ip}:${params.port}`;
  } else if (parsedOptions.action === 'scrape' || s[0] === '/scrape') {
    params.action = common.ACTIONS.SCRAPE;
    if (typeof params.info_hash === 'string') { params.info_hash = [params.info_hash]; }

    if (Array.isArray(params.info_hash)) {
      params.info_hash = params.info_hash.map((binaryInfoHash) => {
        if (typeof binaryInfoHash !== 'string' || binaryInfoHash.length !== 20) { throw new Error('invalid info_hash'); }
        return common.binaryToHex(binaryInfoHash);
      });
    }
  } else {
    throw new Error(`Invalid action in HTTP request: ${params.action}`);
  }

  return params;
};
