export default class Container {
  constructor() {
    this.registeredServices = []
    this.services = []
    this.dependents = []
  }

  register(serviceName, service, dependencies) {
    if (this.hasRegistered(serviceName)) {
      throw new Error('service with name ' + serviceName + 'already has been registered')
    }
    this.registeredServices.push({name: serviceName, service: service, dependencies: dependencies})
  }

  hasRegistered(name) {
    return this.registeredServices.find(s => s.name == name)
  }

  hasService(name) {
    return this.services.find(s => s.name == name)
  }

  getter() {
    return (serviceName) => {
      let service = this.services.find((service) => service.name == serviceName)
      if (service) {
        return service.service
      }
      throw new Error('service ' + serviceName + ' is not registered on container')
    }
  }

  build() {
    let self = this
    this.registeredServices.map((o) => {
      if (o.dependencies && o.dependencies.length > 0) {
        let notResolveds = o.dependencies.length
        o.dependencies.forEach((d) => {
          if (self.hasService(d)) {
            notResolveds--
          }
        })
        if (notResolveds == 0) {
          self.services.push({name: o.name, service: require(o.service)})
        } else {
          self.dependents.push(o)
        }
      } else {
        self.services.push({name: o.name, service: require(o.service)})
      }
    })
    let lastDependentsLength = this.dependents.length
    while(this.dependents.length > 0) {
      this.dependents.map((o, index) => {
        let notResolveds = o.dependencies.length
        o.dependencies.forEach((d) => {
          if (self.hasService(d)) {
            notResolveds--
          }
        })
        if (notResolveds == 0) {
          self.services.push({name: o.name, service: require(o.service)})
          self.dependents.splice(index, 1)
        }
      })
      if (lastDependentsLength == this.dependents.length) {
        let unresolveds = this.dependents.map(d => {
          return d.name
        })
        throw new Error('The services: ' + unresolveds + ' has not resolution modules')
      } else {
        lastDependentsLength = this.dependents.length
      }
    }
  }
}